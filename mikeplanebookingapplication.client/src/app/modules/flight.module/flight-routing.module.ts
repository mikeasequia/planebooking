import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightMainComponent } from './route-components/plane-main/flight-main.component';

const routes: Routes = [
  {
    path: '', component: FlightMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
