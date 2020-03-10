import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AuthorizationRules } from '../../_services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  currentUser: any;

  isAuthorized = {
    CONFIGURE: () => {
      return this.currentUser && AuthorizationRules.CONFIGURE.includes(this.currentUser.role);
    },
    BOOKINGS: () => {
      return this.currentUser && AuthorizationRules.BOOKINGS.includes(this.currentUser.role);
    },
    MYBOOKINGS: () => {
      return this.currentUser && AuthorizationRules.MYBOOKINGS.includes(this.currentUser.role);
    }
  }

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

}
