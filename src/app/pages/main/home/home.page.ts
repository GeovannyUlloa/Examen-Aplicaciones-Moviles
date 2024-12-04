import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajesService } from '../../../viajes.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TimeService } from 'src/app/services/time.service';
// import { EmailService } from 'src/app/services/email.service'; 
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  // emailService = inject(EmailService); 
  username: string | null = '';
  viajes: any[] = [];
  horaChile: string = '';  

  private timeService = inject(TimeService);
  
  userRole: string = ''; 

  constructor(private viajesService: ViajesService, private router: Router) { }

  ngOnInit() {
    this.userRole = this.utilsService.getLocalStorage('role') || '';

    this.cargarViajes();
    this.timeService.hora$.subscribe(hora => {
      this.horaChile = hora;
    });
  }

  cargarViajes() {
    this.viajesService.obtenerViajes().subscribe(viajes => {
      this.viajes = viajes;
    });
  }
  selectTrip(viaje: any) {
    this.utilsService.saveLocalStorage('selectedTrip', viaje);  // Guardamos el viaje seleccionado en el almacenamiento local
    this.router.navigate(['/main/confirm-trip']);  // Redirigimos a la página de confirmación
  }

  // Verificar si el usuario es el conductor del viaje
  esConductor(viaje: any): boolean {
    const currentUser = this.user();
    return currentUser && viaje.conductor === currentUser.name;
  }

  // Mostrar detalles de los pasajeros para el conductor
  verPasajeros(viaje: any) {
    if (this.esConductor(viaje)) {
      // Redirigir a una página o modal que muestra los pasajeros del viaje
      this.router.navigate(['/main/viaje-detalle'], { queryParams: { id: viaje.id } });
    } else {
      this.utilsService.presentToast({
        message: 'No tienes permiso para ver los pasajeros de este viaje.',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
    }
  }

//   reservarViaje(viaje: any) {
//     if (this.userRole === 'pasajero') {
//         this.emailService.enviarConfirmacion(viaje, this.user()?.email, viaje.conductorEmail)
//             .then(() => {
//                 this.utilsService.presentToast({
//                     message: 'Reserva realizada con éxito.',
//                     duration: 2500,
//                     color: 'success',
//                     position: 'bottom',
//                     icon: 'checkmark-circle-outline'
//                 });
                
//                 // Aquí podrías llamar al método agregarReserva para actualizar Firestore
//                 this.viajesService.agregarReserva(viaje, this.user()?.email);
//             })
//             .catch((error) => {
//                 this.utilsService.presentToast({
//                     message: 'Error al realizar la reserva.',
//                     duration: 2500,
//                     color: 'danger',
//                     position: 'bottom',
//                     icon: 'alert-circle-outline'
//                 });
//                 console.log(error);
//             });
//     } else {
//         this.utilsService.presentToast({
//             message: 'No tienes permiso para reservar un viaje.',
//             duration: 2500,
//             color: 'danger',
//             position: 'bottom',
//             icon: 'alert-circle-outline'
//         });
//     }
// }
  addTrip() {
    this.router.navigate(['/main/add-trip']);
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }
}
