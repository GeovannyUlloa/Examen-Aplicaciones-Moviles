import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  constructor() { }

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();

      await loading.present();

      this.firebaseService.signIn(this.form.value as User)
        .then(resp => {
          this.getUserInfo(resp.user.uid);
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

    } else {
      console.log('Formulario inválido');
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
  
      let path = `users/${uid}`;
  
      this.firebaseService.getDocument(path)
        .then((user: User) => {
          // Guarda el usuario completo en localStorage
          this.utilsService.saveLocalStorage('user', user);
          
          // Guarda solo el rol en localStorage
          this.utilsService.saveLocalStorage('role', user.role);
  
          // Redirige a la página de inicio
          this.utilsService.routerLink('main/home');
          this.form.reset();
          this.utilsService.presentToast({
              message: `Bienvenido ${user.name}`,
              duration: 1500,
              color: 'primary',
              position: 'bottom',
              icon: 'person-circle-outline'
          });
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
    } else {
      console.log('Formulario inválido');
    }
  }
}
