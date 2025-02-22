import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightMainComponent } from './flight-main.component';
import { FlightService } from '../../../../infrastructure/data.module/services/flight.service';
import { AppConfigService } from '../../../../common/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilitiesService } from '../../../../infrastructure/data.module/services/utilities.service';

describe('FlightMainComponent', () => {
  let component: FlightMainComponent;
  let fixture: ComponentFixture<FlightMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FlightMainComponent],
      providers: [FlightService, AppConfigService, UtilitiesService]
    });
    fixture = TestBed.createComponent(FlightMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
