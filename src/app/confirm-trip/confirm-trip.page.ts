import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-confirm-trip',
  templateUrl: './confirm-trip.page.html',
  styleUrls: ['./confirm-trip.page.scss'],
})
export class ConfirmTripPage implements OnInit {
  selectedTrip: any;

  constructor(
    private router: Router, 
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    // Recuperar el viaje seleccionado desde localStorage
    this.selectedTrip = JSON.parse(localStorage.getItem('selectedTrip') || '{}');
  }

  confirmReservation() {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener el usuario actual
    const ownerEmail = this.selectedTrip.conductorEmail; // Email del dueño del vehículo
    const passengerEmail = user.email; // Email del pasajero


  }
}
