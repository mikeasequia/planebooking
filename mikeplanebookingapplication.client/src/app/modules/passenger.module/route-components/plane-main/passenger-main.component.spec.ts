import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassengerMainComponent } from './passenger-main.component';
import { PassengerService } from '../../../../infrastructure/data.module/services/passenger.service';
import { AppConfigService } from '../../../../common/app-config.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilitiesService } from '../../../../infrastructure/data.module/services/utilities.service';

describe('PassengerMainComponent', () => {
  let component: PassengerMainComponent;
  let fixture: ComponentFixture<PassengerMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PassengerMainComponent],
      providers: [
        PassengerService,
        AppConfigService,
        HttpClient,
        UtilitiesService
      ]
    });
    fixture = TestBed.createComponent(PassengerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
