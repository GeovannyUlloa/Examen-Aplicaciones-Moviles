import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajesService } from 'src/app/viajes.service';
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
    private utilsService: UtilsService,
    private viajesService: ViajesService
  ) {}

  ngOnInit() {
    this.selectedTrip = this.utilsService.getLocalStorage('selectedTrip');
    if (!this.selectedTrip) {
      this.utilsService.presentToast({
        message: 'No se ha seleccionado ningún viaje',
        duration: 2500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      this.router.navigate(['/main/home']);
    }
  }

  async confirmReservation() {
    try {
      await this.viajesService.inscribirPasajero(this.selectedTrip.id);
      
      this.utilsService.presentToast({
        message: 'Te has inscrito al viaje exitosamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
      
      this.router.navigate(['/main/home']);
    } catch (error: any) {
      this.utilsService.presentToast({
        message: error.message || 'Error al inscribirse al viaje',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }

  cancelReservation() {
    this.router.navigate(['/main/home']);
  }
}
