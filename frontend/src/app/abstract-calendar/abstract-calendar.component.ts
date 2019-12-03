import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../model';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { RoomService } from '../_services/room.service';

// useful documentation : https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxscheduler/jquery-scheduler-api.htm
// and https://www.jqwidgets.com/angular-components-documentation/documentation/jqxscheduler/angular-scheduler-api.htm

class EventPrivateData {
  id: string;
  title: string
  organization: string;
  roomId: string;
  tag: string;
  description: string;
}

@Component({
  selector: 'app-abstract-calendar',
  templateUrl: './abstract-calendar.component.html',
  styleUrls: ['./abstract-calendar.component.scss']
})
export abstract class AbstractCalendarComponent {
  @ViewChild('schedulerReference', {static: false})
  myScheduler: jqxSchedulerComponent;

  @Input()
  scaleStartHour = 7;
  @Input()
  scaleEndHour = 21;
  @Input()
  disabled = false;
  @Input()
  readOnly = false;
  @Input()
  showViews = [];
  @Input()
  height = 400;
  @Input()
  width = 500;

  source: any = 
  {
      dataType: "array",
      dataFields: [
          { name: 'id', type: 'string' },
          { name: 'organization', type: 'string' },
          { name: 'subject', type: 'string' },
          { name: 'privateDatas', type: 'string' },
          { name: 'room', type: 'string' },
          { name: 'start', type: 'date' },
          { name: 'end', type: 'date' },
      ],
      id: 'id',
      localdata: [],
  };
  dataAdapter: any = new jqx.dataAdapter(this.source);
  date: any = new jqx.date('todayDate');
  appointmentDataFields: any  = {
      from: "start",
      to: "end",
      id: "id",
      description: "privateDatas",
      location: "organization",
      subject: "subject",
      resourceId: "room",
  };
  resources: any =
  {
      colorScheme: "scheme05",
      dataField: "room",
      // orientation: "horizontal",
      source: new jqx.dataAdapter(this.source)
  };
  views: any[] = [];
  rooms: Room[] = [];
  bookings: Booking[]= [];

  constructor(
    protected bookingService: BookingService,
    protected roomService: RoomService
   ) { }

   createViews() {
    if (this.showViews.includes('weekView')) {
        this.views.push({ 
            type: 'weekView',
            showWeekends: false,
            timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
            allDayRowHeight: 24,
            rowHeight: (this.height - 160) / 20,
            showWorkTime : false,
        });
    }
    if (this.showViews.includes('dayView')) {
        this.views.push({ 
            type: 'dayView',
            showWeekends: false,
            timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
            allDayRowHeight: 24,
            rowHeight: (this.height - 160) / 20,
            showWorkTime : false,
        });
    }
    if (this.showViews.includes('monthView')) {
      this.views.push({ 
          type: 'monthView',
          showWeekends: false,
          timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
          showWorkTime : false,
      });
  }
}

abstract getBookingFilter(): any;
abstract processBooking(booking): Booking;

abstract afterBookingFetched();

async getRooms(room?: Room) {
  if (room) {
    this.rooms = [room];
  } else {
    this.rooms = await this.roomService.getRooms().toPromise();
  }
}

getBookings() {
  this.bookingService.getBookings(this.getBookingFilter()).subscribe(
        bookings => {
            this.bookings = bookings;
            this.myScheduler.beginAppointmentsUpdate();
            this.myScheduler.getAppointments().forEach(
                appointment => {this.myScheduler.deleteAppointment(appointment.id as string);}
            );
            bookings.forEach(fetchBooking => {
                let booking = this.processBooking(fetchBooking);
                if (new Date(booking.startDate).valueOf() < new Date(booking.endDate).valueOf()) {
                  try {
                    let appointment = this.booking2event(booking);
                    this.myScheduler.addAppointment(appointment);
                  } catch (e) {
                    console.error(e);
                  }
                }
            });
            this.afterBookingFetched();
            this.myScheduler.endAppointmentsUpdate();
        }
    );
}

booking2event(booking: Booking) {
    let privateDatas: EventPrivateData = {
        id: booking.ref,
        title: booking.title,
        organization: booking.organizationId,
        roomId: booking.roomId,
        tag: 'unavailable',
        description: booking.details
    };
    let room = this.rooms.find(room => room.id === booking.roomId);
    if (!room) {
      throw Error(`Unable to find the room with id '${booking.roomId}' for booking '${JSON.stringify(booking)}'`)
    }
    return {
      id: booking.ref,
      // subject: booking.startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
                  // + "-" + booking.endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
      subject: `${booking.startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}-${booking.endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} [${booking.organizationId}] [${room.name}] ${booking.title}`,
      privateDatas: JSON.stringify(privateDatas),
      room: room.name,
      start: booking.startDate, // convert to local time
      end: booking.endDate, // convert to local time
      organization: booking.organizationId,
    }
}

event2booking(appointment) {
  let privateDatas: EventPrivateData = JSON.parse(appointment.originalData.privateDatas);
  let bookingRef = privateDatas.id;
  return this.bookings.find(booking => booking.ref === bookingRef);
}

onAppointmentAdd(appointment, privateDatas: EventPrivateData) {
    this.myScheduler.setAppointmentProperty(appointment.id, 'resizable', !this.readOnly);
    this.myScheduler.setAppointmentProperty(appointment.id, 'draggable', !this.readOnly);
    this.myScheduler.setAppointmentProperty(appointment.id, 'readOnly', this.readOnly);
    this.myScheduler.setAppointmentProperty(appointment.id, 'tooltip', '');
}

configureScheduler(lockScheduler: boolean = true) {
  if (lockScheduler) this.myScheduler.beginAppointmentsUpdate();

    this.myScheduler.editDialog(false);

    this.myScheduler.onAppointmentAdd.subscribe((event: any) => {
        let args = event.args;
        let appointment = args.appointment;
        let privateDatas: EventPrivateData = JSON.parse(appointment.originalData.privateDatas);
        this.onAppointmentAdd(appointment, privateDatas);
    });
    this.myScheduler.onCellClick.subscribe((event: any) => {
        console.log("RoomCalendar::onCellClick() date=", event.args.date.toDate());
        let selection = this.myScheduler.getSelection();
        console.log("RoomCalendar::onCellClick() selection from=", selection.from.toDate(), "to=", selection.to.toDate(), "resource=", selection.ResourceId);
    });
    // this.myScheduler.onContextMenuCreate.subscribe((event) => {
    //     console.log("RoomCalendar::onContextMenuCreate(), event=", event);
    //     event.args.menu.empty();
    //     return event;
    // });
    // this.myScheduler.source = new jqx.dataAdapter(this.source);
    // this.myScheduler.resources = this.resources;
    if (lockScheduler) this.myScheduler.endAppointmentsUpdate();

}

}
