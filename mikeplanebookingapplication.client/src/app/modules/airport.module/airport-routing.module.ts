import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportMainComponent } from './route-components/airport-main/airport-main.component';

const routes: Routes = [
  {
    path: '', component: AirportMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportRoutingModule { }
