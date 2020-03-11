import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService, AuthorizationRules } from '../../_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  currentUser: any;

  @ViewChild('serviceDiv', {static: false})
  serviceDiv: ElementRef;

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
    private renderer: Renderer,
    private element: ElementRef,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    console.log("route", this.route.snapshot);
    const navbar: HTMLElement = this.element.nativeElement.children[0];
    this.renderer.listenGlobal('window', 'scroll', (event) => {
          const number = window.scrollY;
          if (number > 150 || window.pageYOffset > 150) {
              // add logic
              navbar.classList.remove('nav-link_transparent');
              navbar.classList.remove('navbar-transparent');
              if (this.serviceDiv) {
                this.serviceDiv.nativeElement.classList.remove('invisible');
              }
          } else {
              // remove logic
              navbar.classList.add('navbar-transparent');
              navbar.classList.add('nav-link_transparent');
              if (this.serviceDiv) {
                this.serviceDiv.nativeElement.classList.add('invisible');
              }
          }
      });
  }

}
