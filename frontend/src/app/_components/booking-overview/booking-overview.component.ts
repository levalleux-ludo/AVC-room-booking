import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BookingService } from '../../_services/booking.service';
import { Booking, duration } from '../../_model/booking';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler/public_api';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { OrganizationService } from 'src/app/_services/organization.service';
import { GlobalCalendarComponent } from '../global-calendar/global-calendar.component';
import { WaiterService } from 'src/app/_services/waiter.service';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.scss']
})
export class BookingOverviewComponent implements OnInit {

  @ViewChild('calendar', {static: false})
  calendar: GlobalCalendarComponent;
  // myScheduler: jqxSchedulerComponent;

  // bookings: Booking[];

  organizations: any[] = [];

  // tslint:disable-next-line: variable-name
  _selectedOrganizations: any[] = [];

  get selectedOrganizations() {
    return this._selectedOrganizations;
  }

  selectOrganizations(value) {
    this.selectedOrganizations = value;
  }

  set selectedOrganizations(value) {
    this._selectedOrganizations = value;
    if (this.calendar) { this.calendar.bookingFilter = this.bookingFilter; }
  }


  // source: any =
  // {
  //     dataType: "array",
  //     dataFields: [
  //         { name: 'id', type: 'string' },
  //         { name: 'organization', type: 'string' },
  //         { name: 'subject', type: 'string' },
  //         { name: 'privateDatas', type: 'string' },
  //         { name: 'room', type: 'string' },
  //         { name: 'start', type: 'date' },
  //         { name: 'end', type: 'date' },
  //     ],
  //     id: 'id',
  //     localData: [],
  // };
  // dataAdapter: any = new jqx.dataAdapter(this.source);
  // date: any = new jqx.date('todayDate');
  // appointmentDataFields: any  = {
  //     from: "start",
  //     to: "end",
  //     id: "id",
  //     description: "privateDatas",
  //     location: "organization",
  //     subject: "subject",
  //     resourceId: "room",
  // };
  // resources: any =
  // {
  //     colorScheme: "scheme05",
  //     dataField: "room",
  //     orientation: "horizontal",
  //     source: new jqx.dataAdapter(this.source)
  // };
  // views: any[] = [];
  // @Input()
  // scaleStartHour = 8;
  // @Input()
  // scaleEndHour = 19;
  // @Input()
  // height = 500;
  // @Input()
  // width = 800;
  constructor(
    private bookingService: BookingService,
    private authenticationService: AuthenticationService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private waiter: WaiterService
  ) { }

  ngOnInit() {
    console.log("Bookings: route", this.route);
    const path = this.route.snapshot.routeConfig.path;
    console.log("path", path);
    const filterPerUser = path.endsWith('mybookings');
    const waiterTask = this.waiter.addTask();
    this.organizationService.getOrganizations().subscribe((organizations) => {
      if (filterPerUser) {
        const memberOf = this.authenticationService.currentUserValue.memberOf;
        console.log("Filter per user", memberOf);
        this.organizations = organizations.filter(orga => memberOf.includes(orga.id));
      } else {
        this.organizations = organizations;
      }
      this.selectedOrganizations = Array.from(this.organizations);
      // this.getBookings();
      this.waiter.removeTask(waiterTask);
    }, err => {
      alert(err);
      this.waiter.removeTask(waiterTask);
    });
  }
  //   this.views.push({
  //     type: 'weekView',
  //     showWeekends: false,
  //     timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //     allDayRowHeight: 24,
  //     rowHeight: (this.height - 160) / 20,
  //     showWorkTime : false,
  // });
  // this.views.push({
  //     type: 'dayView',
  //     showWeekends: false,
  //     timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //     allDayRowHeight: 24,
  //     rowHeight: (this.height - 160) / 20,
  //     showWorkTime : false,
  // });
  // this.views.push({
  //   type: 'monthView',
  //   showWeekends: false,
  //   timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
  //   // allDayRowHeight: 24,
  //   // rowHeight: (this.height - 160) / 20,
  //   showWorkTime : false,
// });

  // getBookings() {
  //   this.bookingService.getBookings().subscribe(
  //     bookings => {
  //       const orgaIds = this.selectedOrganizations.map(orga => orga.id);
  //       this.bookings = bookings.filter(
  //         booking => booking.privateDataRef && orgaIds.includes(booking.privateDataRef.organizationId)
  //       );
  //     });
  // }

  duration(booking: Booking) {
    duration(booking);
  }

  bookingFilter = (booking) => {
    const orgaIds = this.selectedOrganizations.map(orga => orga.id);
    return booking.privateDataRef && orgaIds.includes(booking.privateDataRef.organizationId);
  }


}
