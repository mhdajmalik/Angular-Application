import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//components
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';

//service
import { DashboardService } from './dashboard.service'
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DashboardPageComponent
  ],

  providers:[DashboardService]
})
export class DashboardModule { }
