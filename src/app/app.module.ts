import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardPageComponent } from './dashboard/components/dashboard-page/dashboard-page.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
