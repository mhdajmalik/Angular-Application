/*
 * This service contain common function to call server data
 * Data Acces layer
*/ 

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_URL } from '../../../config';
import 'rxjs/add/operator/map'

import { DdsapService } from './ddsap.service'
@Injectable()
export class HttpService {

  constructor(private http: HttpClient, private ddsapService:DdsapService) { }


   callServerAPI(objectName, methodName, body) {
    let options = { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8') };

    this.getUrlParams(objectName, methodName, body);    
    return this.http
      .post(`${API_URL}`, this.getUrlParams(objectName, methodName, body), options)
      .map(
        (data: any) => {
          if (data.ReturnValue && data.ReturnValue.ReturnValue) {
            data.ReturnValue = data.ReturnValue.ReturnValue;
          }
          if (typeof data.ReturnValue == 'string' && data.ReturnValue.startsWith('{"Data":')) {
            var tempDat = JSON.parse(data.ReturnValue);

            if (tempDat.TID) {
              // if (typeof (Storage) !== "undefined") {
              //   sessionStorage.setItem("_tid", tempDat.TID);
              // }              
              this.ddsapService.tid = tempDat.TID;
            }

            data.ReturnValue = JSON.parse(tempDat.Data);
          }
          return data.ReturnValue;
        },
        (err) => err.json()
      );

  }


   private getUrlParams(objectName, methodName, body) {
    let data =
      "ObjName=" + objectName +
      "&MethodName=" + methodName +
      "&InParams=" + JSON.stringify({
        Data: JSON.stringify(body),
        TID: encodeURIComponent(this.ddsapService.tid)
      });
    return data;
  }
}
