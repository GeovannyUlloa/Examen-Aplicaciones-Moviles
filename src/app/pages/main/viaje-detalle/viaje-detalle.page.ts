import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajesService } from '../../../viajes.service';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.page.html',
  styleUrls: ['./viaje-detalle.page.scss'],
})
export class ViajeDetallePage implements OnInit {
  viajeId: string | null = null;
  viaje: any = null;

  constructor(private route: ActivatedRoute, private viajesService: ViajesService) {}

  ngOnInit() {
    // Obtener el ID del viaje desde los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.viajeId = params['id'];  // Asumiendo que el id es pasado como parámetro en la ruta
      if (this.viajeId) {
        this.cargarViaje();
      }
    });
  }

  cargarViaje() {
    if (this.viajeId) {
      // Llamamos al servicio para obtener los detalles del viaje por su ID
      this.viajesService.obtenerViajePorId(this.viajeId).subscribe(data => {
        this.viaje = data;  // Asignamos los datos del viaje a la variable viaje
      });
    }
  }

}
