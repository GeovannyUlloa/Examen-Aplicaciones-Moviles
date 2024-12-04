import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViajesService } from '../../../viajes.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.page.html',
  styleUrls: ['./add-trip.page.scss'],
})
export class AddTripPage {
  
  nuevoViaje = {
    destino: '',
    conductor: '',
    fecha: '',
    hora: '',
    puntoEncuentro: '',
    pasajerosActuales: 0,
    pasajerosMaximos: 1,
    pagoPorPasajero: 0, // Nueva propiedad
  };

  constructor(private viajesService: ViajesService, private router: Router, private utilsService: UtilsService) {}

  ngOnInit() {
    // Obtener el nombre del usuario desde el almacenamiento local
    const usuario = this.utilsService.getLocalStorage('user');
    if (usuario && usuario.name) {
      this.nuevoViaje.conductor = usuario.name;  // Asocia el nombre del dueño como conductor
    }
  }

  agregarNuevoViaje() {

    if (this.nuevoViaje.pasajerosActuales > this.nuevoViaje.pasajerosMaximos) {
      console.error('El número de pasajeros actuales no puede ser mayor que el número de pasajeros máximos.');
      return;
    }

    if (this.nuevoViaje.destino && this.nuevoViaje.conductor && this.nuevoViaje.fecha && this.nuevoViaje.hora && this.nuevoViaje.puntoEncuentro && this.nuevoViaje.pasajerosActuales >= 0) {
      this.viajesService.agregarViaje(this.nuevoViaje);
      this.router.navigate(['/main/home']);
    } else {
      console.error('Por favor completa todos los campos.');
    }
  }
}