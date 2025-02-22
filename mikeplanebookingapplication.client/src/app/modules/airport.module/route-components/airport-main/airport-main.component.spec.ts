import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirportMainComponent } from './airport-main.component';
import { AirportService } from '../../../../infrastructure/data.module/services/airport.service';
import { AppConfigService } from '../../../../common/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilitiesService } from '../../../../infrastructure/data.module/services/utilities.service';
import { InjectionToken } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

describe('AirportMainComponent', () => {
  let component: AirportMainComponent;
  let fixture: ComponentFixture<AirportMainComponent>;

  // Define the InjectionToken (if it isn't already in a shared module)
  const TOAST_CONFIG = new InjectionToken('ToastConfig');

  // Mock ToastConfig for testing
  const mockToastConfig = {
    duration: 5000, // mock config values
    position: 'top-right',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AirportMainComponent],
      providers: [
        AirportService,
        AppConfigService,
        UtilitiesService,
        ToastrService,
        { provide: TOAST_CONFIG, useValue: mockToastConfig }, // Provide mock value
      ]
    });
    fixture = TestBed.createComponent(AirportMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
