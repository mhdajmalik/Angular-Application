import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpService } from './services/http.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[HttpService]
})
export class SharedModule { }
