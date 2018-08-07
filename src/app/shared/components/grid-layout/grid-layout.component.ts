import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
declare var $: any;

declare var GridList: any;

@Component({
  selector: 'grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.css']
})
export class GridLayoutComponent implements AfterViewInit {

  @ViewChild('gridContainer') grid: ElementRef;
  constructor() { }

  ngAfterViewInit() {
    $(this.grid.nativeElement).gridList({
      lanes: 8,
      direction: 'horizontal',
      widthHeightRatio: 3.5,
      heightToFontSizeRatio: 0.87
    });

      $(this.grid.nativeElement).gridList('resize', 8); // lanes given as 8 means 8 column
  }

}
