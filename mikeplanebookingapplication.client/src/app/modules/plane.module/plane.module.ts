import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaneRoutingModule } from './plane-routing.module';
import { PlaneMainComponent } from './route-components/plane-main/plane-main.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlaneInfoModalComponent } from './components/plane-info-modal/plane-info-modal.component';
import { SharedService } from 'src/app/infrastructure/data.module/services/shared.service';


@NgModule({
  declarations: [
    PlaneMainComponent,
    PlaneInfoModalComponent
  ],
  imports: [
    CommonModule,
    PlaneRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [
    SharedService,
  ]
})
export class PlaneModule { }
