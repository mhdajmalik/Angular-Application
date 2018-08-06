import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


//custom module
import { DashboardModule } from '../app/dashboard/dashboard.module';
import { SharedModule } from '../app/shared/shared.module';


//services
import { HttpService } from '../app/shared/services/http.service'

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    DashboardModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
