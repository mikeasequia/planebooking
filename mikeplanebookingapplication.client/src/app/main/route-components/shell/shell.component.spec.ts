import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellComponent } from './shell.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ShellComponent,
        SideBarComponent
      ]
    });
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
