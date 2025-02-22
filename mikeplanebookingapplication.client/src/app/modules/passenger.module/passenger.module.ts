import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PassengerMainComponent } from './route-components/plane-main/passenger-main.component';
import { PassengerRoutingModule } from './passenger-routing.module';
import { PassengerInfoModalComponent } from './components/passenger-info-modal/passenger-info-modal.component';


@NgModule({
  declarations: [
    PassengerMainComponent,
    PassengerInfoModalComponent
  ],
  imports: [
    CommonModule,
    PassengerRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class PassengerModule { }
