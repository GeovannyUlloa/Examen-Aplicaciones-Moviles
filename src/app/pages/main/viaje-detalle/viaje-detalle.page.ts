import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViajesService } from '../../../viajes.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.page.html',
  styleUrls: ['./viaje-detalle.page.scss'],
})
export class ViajeDetallePage implements OnInit {
  viajeId: string | null = null;
  viaje: any = null;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private viajesService: ViajesService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.currentUser = this.utilsService.getLocalStorage('user');
    this.route.queryParams.subscribe(params => {
      this.viajeId = params['id'];
      if (this.viajeId) {
        this.cargarViaje();
      }
    });
  }

  cargarViaje() {
    if (this.viajeId) {
      this.viajesService.obtenerViajePorId(this.viajeId).subscribe(data => {
        this.viaje = data;
        if (this.viaje.conductorId !== this.currentUser?.uid) {
          this.utilsService.presentToast({
            message: 'No tienes permiso para ver este viaje',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        }
      });
    }
  }

  confirmarReserva() {
    // Logic to confirm reservation can be added here
  }

  volver() {
    this.router.navigate(['/main/home']);
  }
}
