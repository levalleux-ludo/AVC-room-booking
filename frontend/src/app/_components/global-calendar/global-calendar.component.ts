import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AbstractCalendarComponent } from '../abstract-calendar/abstract-calendar.component';
import { Booking } from '../../_model/booking';
import { BookingService } from '../../_services/booking.service';
import { RoomService } from '../../_services/room.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { OrganizationService } from '../../_services/organization.service';
import { Organization } from '../../_model/organization';
import { WaiterService } from 'src/app/_services/waiter.service';
import { RecurrentEventService } from 'src/app/_services/recurrent-event.service';

@Component({
  selector: 'app-global-calendar',
  templateUrl: './global-calendar.component.html',
  styleUrls: ['./global-calendar.component.scss']
})
export class GlobalCalendarComponent extends AbstractCalendarComponent implements OnInit, AfterViewInit {

  constructor(
    protected bookingService: BookingService,
    protected roomService: RoomService,
    protected organizationService: OrganizationService,
    protected dialog: MatDialog,
    protected waiter: WaiterService,
    protected recurrentEventService: RecurrentEventService
  )
  {
      super(bookingService, organizationService, roomService, waiter);
      this.getRooms().then(() => {
        for (let room of this.rooms) {
          this.source.localdata.push({
            id: "fake",
            subject: '',
            privateDatas: null,
            room: room.name,
            start: new Date(0),
            end: new Date(0),
            organization: ''
          })
        }
        this.dataAdapter = new jqx.dataAdapter(this.source);
        this.dataAdapter.dataBind();
      });
      this.getOrganizations();
  }

  minDate = new jqx.date('01-01-2019'); // default is today

  getBookingFilter() {
    return {};
  }
  processBooking(booking: any): Booking {

    return booking;
  }
  afterBookingFetched() {
    this.myScheduler.showLegend(false); // Required otherwise the legend keeps invisible
    this.myScheduler.showLegend(true);
  }

  editDialogCreate = (arg?: (dialog?: any, fields?: any, editAppointment?: any) => any) => {
    // let args = event.args;
    // let dialog = args.dialog;
    // let appointment = args.appointment;
    // let fields = args.fields;
    console.log("onEditDialogCreate");
    return undefined
  }

    configureScheduler() {
    this.myScheduler.beginAppointmentsUpdate();
    super.configureScheduler(false);

    this.myScheduler.onCellDoubleClick.subscribe(event => {
      console.log("GlobalCalendar::onCellDoubleClick, event=", event);
    });

    this.myScheduler.onAppointmentDoubleClick.subscribe(event => {
      console.log("GlobalCalendar::onAppointmentDoubleClick, event=", event);
      if (event.args) {
        let appointment = event.args.appointment;
        if (appointment) {
          BookingDialogComponent.editBooking(
            this.dialog,
            this.bookingService,
            this.recurrentEventService,
            (orga) => this.organizationService.createOrganization(orga),
            (booking, privateData) => {
                // TODO refresh calendar to show new or updated or deleted booking
                this.getBookings();
            },
            this.organizations,
            this.rooms,
            this.event2booking(appointment)
          );
        }
      }
    });

    this.myScheduler.onContextMenuOpen.subscribe((event) => {
      console.log("GlobalCalendar::onContextMenuOpen(), event=", event);
      event.args.menu.empty();
      return event;
    });
    this.myScheduler.endAppointmentsUpdate();
}

  ngOnInit() {
    this.createViews();
}

  ngAfterViewInit(): void {
    this.configureScheduler();
    this.getOrganizations(() => this.getBookings());
  }



}
