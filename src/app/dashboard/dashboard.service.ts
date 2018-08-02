import { Injectable } from '@angular/core';

import { HttpService } from '../shared/services/http.service'

@Injectable()
export class DashboardService {

  constructor(private httpService:HttpService) { }


  getViewContent(){

  }
}
