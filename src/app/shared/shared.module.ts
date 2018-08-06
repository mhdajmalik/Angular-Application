import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpService } from './services/http.service';

import { TileElementComponent } from './components/tile-element/tile-element.component';
import { GridLayoutComponent } from './components/grid-layout/grid-layout.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TileElementComponent, GridLayoutComponent],
  providers:[HttpService],
  exports:[TileElementComponent,GridLayoutComponent]
})
export class SharedModule { }
