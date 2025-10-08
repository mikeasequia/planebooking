import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirportRoutingModule } from './airport-routing.module';
import { AirportMainComponent } from './route-components/airport-main/airport-main.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AirportInfoModalComponent } from './components/airport-info-modal/airport-info-modal.component';
import { SharedService } from 'src/app/infrastructure/data.module/services/shared.service';

@NgModule({
  declarations: [
    AirportMainComponent,
    AirportInfoModalComponent
  ],
  imports: [
    CommonModule,
    AirportRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [
    SharedService,
  ]
})
export class AirportModule { }
