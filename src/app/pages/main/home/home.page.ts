import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajesService } from '../../../viajes.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  private timeService = inject(TimeService);

  username: string | null = '';
  viajes: any[] = [];
  horaChile: string = '';  
  userRole: string = ''; 
  currentUser: User | null = null;
  
  constructor(private viajesService: ViajesService, private router: Router) { }

  ngOnInit() {
    this.userRole = this.utilsService.getLocalStorage('role') || '';
    this.currentUser = this.utilsService.getLocalStorage('user');
    this.cargarViajes();
    this.timeService.hora$.subscribe(hora => {
      this.horaChile = hora;
    });
  }

  cargarViajes() {
    if (this.userRole === 'dueño') {
      // Si es dueño, obtener solo sus viajes
      this.viajesService.obtenerViajesDelConductor().subscribe(viajes => {
        this.viajes = viajes;
      });
    } else {
      // Si es pasajero, obtener todos los viajes
      this.viajesService.obtenerViajes().subscribe(viajes => {
        this.viajes = viajes;
      });
    }
  }

  selectTrip(viaje: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.userRole === 'dueño') {
      this.verPasajeros(viaje);
    } else if (viaje.pasajerosActuales >= viaje.pasajerosMaximos) {
      this.utilsService.presentToast({
        message: 'Este viaje está lleno',
        duration: 2500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } else {
      this.utilsService.saveLocalStorage('selectedTrip', viaje);
      this.router.navigate(['/main/confirm-trip']);
    }
  }

  verPasajeros(viaje: any) {
    if (this.esConductor(viaje)) {
      this.router.navigate(['/main/viaje-detalle'], { queryParams: { id: viaje.id } });
    } else {
      this.utilsService.presentToast({
        message: 'No tienes permiso para ver los pasajeros de este viaje.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }

  esConductor(viaje: any): boolean {
    const currentUser = this.user();
    return currentUser && viaje.conductorId === currentUser.uid;
  }

  addTrip() {
    this.router.navigate(['/main/add-trip']);
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }
}
