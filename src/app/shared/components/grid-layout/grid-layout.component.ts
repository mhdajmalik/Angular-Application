import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
declare var $: any;
 
declare var GridList: any;

@Component({
  selector: 'grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.css']
})
export class GridLayoutComponent implements AfterViewInit {

  @ViewChild('gridList') grid: ElementRef;
  constructor() { }

  ngAfterViewInit() {
    var items = ['1','2','3'];

    

    console.log(this.grid);
    $(this.grid.nativeElement).gridList({ lanes: 3 }, { handle: '.title' });
  }

}
