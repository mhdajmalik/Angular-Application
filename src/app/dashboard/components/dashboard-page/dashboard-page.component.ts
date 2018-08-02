import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../../dashboard.service'

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  currentLevel:String='';


  constructor(private dashboardService:DashboardService) { }

  ngOnInit() {
    this.getViewContent();
  }

  getViewContent(){
    this.dashboardService.getViewContent();
  }

}
