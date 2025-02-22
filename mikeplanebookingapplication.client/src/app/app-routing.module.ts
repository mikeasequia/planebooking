import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './main/route-components/shell/shell.component';

const routes: Routes = [
    {
        path: '', component: ShellComponent,
        children: [
          {
            path: 'planes', loadChildren: () => import('./modules/plane.module/plane.module').then(m => m.PlaneModule)
          },
          {
            path: 'airports', loadChildren: () => import('./modules/airport.module/airport.module').then(m => m.AirportModule),
          },
          {
            path: 'flights', loadChildren: () => import('./modules/flight.module/flight.module').then(m => m.FlightModule),
          },
          {
            path: 'passenger_bookings', loadChildren: () => import('./modules/passenger.module/passenger.module').then(m => m.PassengerModule),
          }
        ]
        
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
