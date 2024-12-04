import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]) 
  })
  constructor() { }

  ngOnInit() {
  }
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
  
      this.firebaseService.signUp(this.form.value as User)
        .then(async resp => {
          await this.firebaseService.updateUser(this.form.value.name);
          
          let uid = resp.user.uid;
          this.form.controls.uid.setValue(uid);
          
          // Guardar el rol en el almacenamiento local
          this.utilsService.saveLocalStorage('role', this.form.value.role); // Guardamos el rol aquí
          
          // Función del seteo de la información del usuario
          this.setUserInfo(uid);
        }).catch(error => {
          console.log(error);
          this.utilsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline'
          });
        }).finally(() => {
          loading.dismiss();
        });
    }
  }

  async setUserInfo(uid: string) {
    if(this.form.valid){
      const loading = await this.utilsService.loading();

      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;
      
      this.firebaseService.setDocument(path, this.form.value)
      .then(async resp => {
        this.utilsService.saveLocalStorage('user', this.form.value);
        this.utilsService.routerLink('main/home');
        this.form.reset();

      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
      

      // const username = this.form.value.username || '';

      // sessionStorage.setItem('username', username);

      // this.router.navigate(['/main/home']);
      
      // console.log(this.form.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
