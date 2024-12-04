import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmTripPageRoutingModule } from './confirm-trip-routing.module';

import { ConfirmTripPage } from './confirm-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmTripPageRoutingModule
  ],
  declarations: [ConfirmTripPage]
})
export class ConfirmTripPageModule {}
