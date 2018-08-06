import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'tile-element',
  templateUrl: './tile-element.component.html',
  styleUrls: ['./tile-element.component.css']
})
export class TileElementComponent implements OnInit {

  @Input() configurarion = {};

  constructor() { }

  ngOnInit() {
  }

}
