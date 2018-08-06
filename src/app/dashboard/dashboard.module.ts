import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module'

//components
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
 


//service
import { DashboardService } from './dashboard.service'
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DashboardPageComponent
  ],
  providers:[DashboardService],
  exports:[DashboardPageComponent]
})
export class DashboardModule { }
