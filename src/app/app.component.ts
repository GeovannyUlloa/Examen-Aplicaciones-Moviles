import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userRole: string = 'pasajero'; // Valor por defecto

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    try {
      // Obtener el rol del usuario
      this.userRole = await this.firebaseService.getUserRole();
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
    }
  }

  // Función para verificar si el usuario es conductor
  isConductor(): boolean {
    return this.userRole === 'conductor';
  }
}
