import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassengerMainComponent } from './route-components/plane-main/passenger-main.component';

const routes: Routes = [
  {
    path: '', component: PassengerMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerRoutingModule { }
