import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { InjectionToken } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesService } from './infrastructure/data.module/services/utilities.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Define the InjectionToken
    const TOAST_CONFIG = new InjectionToken('ToastConfig');

    // Mock ToastConfig for testing
    const mockToastConfig = {
      duration: 5000, // mock config values
      position: 'top-right',
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        UtilitiesService,
        ToastrService,
        { provide: TOAST_CONFIG, useValue: mockToastConfig }, // Provide mock value
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
