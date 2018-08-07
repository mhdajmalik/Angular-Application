import { Component, OnInit, Input } from '@angular/core';
declare var CanvasJS: any;

@Component({
  selector: 'tile-element',
  templateUrl: './tile-element.component.html',
  styleUrls: ['./tile-element.component.css']
})
export class TileElementComponent implements OnInit {

  @Input() configurarion = {};
  chart:any;
 

  chartProperties = {
    title: {
      text: "MyFirst Chart"
    },
    data: [{
      type: "column",
      dataPoints: []
    }
    ]
  };

  constructor() { }

  ngOnInit() {
    this.chart = new CanvasJS.Chart("chartContainer", this.chartProperties);
    this.chart.render();
  }

}
