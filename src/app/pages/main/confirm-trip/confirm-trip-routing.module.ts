import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmTripPage } from './confirm-trip.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmTripPageRoutingModule {}
