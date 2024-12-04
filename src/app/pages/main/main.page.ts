import { Component, Inject, OnInit , inject} from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  currentPath: string = '';
  // username: string |null = '';
  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline'},
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline'}
  ]

  userRole: string = '';  // Variable para almacenar el rol del usuario


  ngOnInit() {
    this.getUserRole();
  }

  constructor() { }

  signOut() {
    this.firebaseService.signOut();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  // Método para obtener el rol del usuario y actualizar la variable userRole
  async getUserRole() {
    this.userRole = await this.firebaseService.getUserRole();
  }

  // Método para verificar si el usuario es un "dueño"
  isConductor(): boolean {
    return this.userRole === 'dueño';  // Si el rol es "dueño", retornamos true
  }

}
