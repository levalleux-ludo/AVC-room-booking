import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material';


var _refreshHandlers: {[key: number]: (() => void)} = {};
var _refreshUsers: () => void = undefined;
var _refreshRooms: () => void = undefined;

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onTabChange(event) {
    console.log('onTabChange', event);
    if (_refreshHandlers[event.index]) {
      _refreshHandlers[event.index]();
    }
  }

  registerRefreshHandler(index, refreshComponent: () => void) {
    console.log("called refresh", index, refreshComponent);
    _refreshHandlers[index] = refreshComponent;
  }

}
