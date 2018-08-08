import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


//custom module
import { DashboardModule } from '../app/dashboard/dashboard.module';
import { SharedModule } from '../app/shared/shared.module';


//services
import { HttpService } from '../app/shared/services/http.service'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DdsapService } from '../app/shared/services/ddsap.service';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    DashboardModule,
    HttpClientModule,
    ],
  providers: [HttpService,DdsapService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
