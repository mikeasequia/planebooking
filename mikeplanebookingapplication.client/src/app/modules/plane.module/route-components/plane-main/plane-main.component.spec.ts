import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneMainComponent } from './plane-main.component';
import { PlaneService } from '../../../../infrastructure/data.module/services/plane.service';
import { AppConfigService } from '../../../../common/app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilitiesService } from '../../../../infrastructure/data.module/services/utilities.service';
import { ToastrService } from 'ngx-toastr';

describe('PlaneMainComponent', () => {
  let component: PlaneMainComponent;
  let fixture: ComponentFixture<PlaneMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PlaneMainComponent],
      providers: [PlaneService, AppConfigService, UtilitiesService, ToastrService]
    });
    fixture = TestBed.createComponent(PlaneMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
