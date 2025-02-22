import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ShellComponent } from './main/route-components/shell/shell.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideBarComponent } from './main/components/side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
import { DataModule } from './infrastructure/data.module/data.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    SideBarComponent,
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, 
    NgxDatatableModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    DataModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
