import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
declare var $: any;

declare var GridList: any;

@Component({
  selector: 'grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.css']
})
export class GridLayoutComponent implements OnInit {

  @ViewChild('gridContainer') grid: ElementRef;
  constructor() { }

  ngOnInit() {

    var items = [1, 2, 3, 4]
    for (var i = 0; i < 4; i++) {

      var item = document.createElement('tile-element');
      debugger;

      var lielm = $(
        '<li id=widget"' + i + '">' +
        '<div class="inner itemcontainer">' +
        item.outerHTML +
        '</div>' +
        '</li>'
      );

      lielm.attr({
        'data-w': 4,
        'data-h': 4,
        'data-x': i,
        'data-y': i,
        'data-id': "wid_" + i
      }); 
      $(this.grid.nativeElement).append(lielm);
    }


    $(this.grid.nativeElement).gridList({
      lanes: 8,
      direction: 'horizontal',
      widthHeightRatio: 3.5,
      heightToFontSizeRatio: 0.87
    });

    $(this.grid.nativeElement).gridList('resize', 8); // lanes given as 8 means 8 column



    // context Menu

    //  $.contextMenu({
    //             selector: '.menu', 
    //             callback: function(key, options) {
    //                 var m = "clicked: " + key;
    //                 window.console && console.log(m) || alert(m); 
    //             },
    //             items: {
    //                 "edit": {name: "Edit", icon: "edit"},
    //                 "cut": {name: "Cut", icon: "cut"},
    //                copy: {name: "Copy", icon: "copy"},
    //                 "paste": {name: "Paste", icon: "paste"},
    //                 "delete": {name: "Delete", icon: "delete"},
    //                 "sep1": "---------",
    //                 "quit": {name: "Quit", icon: function(){
    //                     return 'context-menu-icon context-menu-icon-quit';
    //                 }}
    //             }
    //         });

    //         $('.context-menu-one').on('click', function(e){
    //             console.log('clicked', this);
    //         })    


  }

}
