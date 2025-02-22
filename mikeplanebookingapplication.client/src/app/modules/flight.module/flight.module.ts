import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlightMainComponent } from './route-components/plane-main/flight-main.component';
import { FlightInfoModalComponent } from './components/flight-info-modal/flight-info-modal.component';
import { FlightRoutingModule } from './flight-routing.module';


@NgModule({
  declarations: [
    FlightMainComponent,
    FlightInfoModalComponent
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class FlightModule { }
