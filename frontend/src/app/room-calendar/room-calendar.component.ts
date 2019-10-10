import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../model';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { RoomService } from '../_services/room.service';

// useful documentation : https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxscheduler/jquery-scheduler-api.htm
// and https://www.jqwidgets.com/angular-components-documentation/documentation/jqxscheduler/angular-scheduler-api.htm

@Component({
  selector: 'app-room-calendar',
  templateUrl: './room-calendar.component.html',
  styleUrls: ['./room-calendar.component.scss']
})
export class RoomCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('schedulerReference', {static: false})
  myScheduler: jqxSchedulerComponent;

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService

  ) { }

  ngOnInit() {

      this.views = [
          { type: 'dayView', showWeekends: false, timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour } },
          { 
              type: 'weekView',
              showWeekends: false,
              timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
              allDayRowHeight: 24,
              rowHeight: 8,
              showWorkTime : false,
         },
      ]; 
    }
    getBookings() {
        this.bookingService.getBookings({ roomId: this.room.id, dateFrom: new Date() }).subscribe(
            bookings => {
                this.myScheduler.beginAppointmentsUpdate();
                bookings.forEach(booking => {
                    let appointment = this.booking2event(booking, this.room.name);
                    this.myScheduler.addAppointment(appointment);
                });

                // ADD a fake appointment for the past 7 days (useful in week view)
                let hourNow = (new Date()).getHours();
                for (let hour = this.scaleStartHour; hour <= hourNow; hour++) {
                    this.myScheduler.addAppointment(this.getFakeEvent(0, hour));
                }
                for (let pastDay = 1; pastDay < 8; pastDay++) {
                    for (let hour = this.scaleStartHour; hour <= this.scaleEndHour; hour++) {
                        this.myScheduler.addAppointment(this.getFakeEvent(pastDay, hour));
                    }
                }

                this.myScheduler.endAppointmentsUpdate();
            }
        );
    }

    booking2event(booking: Booking, roomName: string) {
        return {
        id: booking.ref,
        title: ' ',
        description: '',
        resourceId: roomName,
        room: roomName,
        start: booking.startTime, // convert to local time
        end: booking.endTime, // convert to local time
        organization: booking.organization,
        resizable: !this.readOnly,
        draggable: !this.readOnly,
        readOnly: this.readOnly,
        tooltip: 'UNAVAILABLE'
        }
    }

    getFakeEvent(pastDay: number, hour: number) {
        let now = new Date();
        let start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - pastDay,
            hour,
            0,
            0,
            0
        )
        let end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - pastDay,
            hour+1,
            0,
            0,
            0
        )
        return {
            id: 'fake'  + uuid(),
            title: ' ',
            description: '',
            organization: '',
            resourceId: this.room.name,
            room: this.room.name,
            start: start, // convert to local time
            end: end, // convert to local time
        }
    }

    setAppointmentProperties(id: string) {
        this.myScheduler.setAppointmentProperty(id, 'resizable', !this.readOnly);
        this.myScheduler.setAppointmentProperty(id, 'draggable', !this.readOnly);
        this.myScheduler.setAppointmentProperty(id, 'readOnly', !this.readOnly);
        this.myScheduler.setAppointmentProperty(id, 'tooltip', '');
    }

    ngAfterViewInit() {
        this.myScheduler.beginAppointmentsUpdate();

        // this.myScheduler.getAppointments().forEach(appointmentDataFields => {
        //     this.setAppointmentProperties(appointmentDataFields.id as string);
        // })
        this.myScheduler.renderAppointment(data => {
            if (data.appointment.location === '') {
                data.style = "#BEBEBE";
            } else {
                data.style = "#8B0000";
            }
            
            data.cssClass = "fake-event";
            data.html = "<div class='fake-event'></div>";
            return data;
        })
        this.myScheduler.onAppointmentAdd.subscribe((event: any) => {
            let args = event.args;
            let appointment = args.appointment;
            this.setAppointmentProperties(appointment.id as string);
        });
        this.myScheduler.endAppointmentsUpdate();
  }

  _room: Room;
  set room(value: Room) {
    this._room = value;
    this.getBookings();
  }
  @Input()
  get room():Room {
    return this._room;
  }

  @Input()
  scaleStartHour = 7;
  @Input()
  scaleEndHour = 21;
  @Input()
  disabled = false;
  @Input()
  readOnly = false;

  minDate = new jqx.date('todayDate'); // default is today

  
    source: any = 
    {
        dataType: "array",
        dataFields: [
            { name: 'id', type: 'string' },
            { name: 'organization', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'room', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' }
        ],
        id: 'id',
        localData: [],
    };
    dataAdapter: any = new jqx.dataAdapter(this.source);
    date: any = new jqx.date('todayDate');
    appointmentDataFields: any  = {
        from: "start",
        to: "end",
        id: "id",
        description: "description",
        location: "organization",
        subject: "title",
        resourceId: "room"
    };
    resources: any =
    {
        colorScheme: "scheme05",
        dataField: "room",
        orientation: "horizontal",
        source: new jqx.dataAdapter(this.source)
    };
    views: any[] = [];
}
