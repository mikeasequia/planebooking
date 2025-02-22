import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaneMainComponent } from './route-components/plane-main/plane-main.component';

const routes: Routes = [
  {
    path: '', component: PlaneMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaneRoutingModule { }
