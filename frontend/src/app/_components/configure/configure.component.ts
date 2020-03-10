import { Component, OnInit } from '@angular/core';
import { MatListOption } from '@angular/material';

var _refreshUsers: () => void = undefined;

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
    if (event.index == 4 && _refreshUsers) {
      _refreshUsers();
    }
  }

  refreshUsers(refreshComponent: () => void) {
    console.log("called refreshUsers", refreshComponent);
    _refreshUsers = refreshComponent;
  }

}
