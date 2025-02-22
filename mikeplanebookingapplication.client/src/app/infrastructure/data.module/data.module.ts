import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiBaseService } from './services/api-base.service';
import { AirportService } from './services/airport.service';
import { PlaneService } from './services/plane.service';
import { AppConfigService } from 'src/app/common/app-config.service';
import { UtilitiesService } from './services/utilities.service';
import { FlightService } from './services/flight.service';
import { PassengerService } from './services/passenger.service';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [
    
    // Services
    AppConfigService,
    ApiBaseService,
    AirportService,
    PlaneService,
    FlightService,
    PassengerService,
    UtilitiesService
  ]
})
export class DataModule {

}
