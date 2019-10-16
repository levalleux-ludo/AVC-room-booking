import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../model';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { RoomService } from '../_services/room.service';
import { PipeResolver } from '@angular/compiler';

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

        if (this.showViews.includes('weekView')) {
            this.views.push({ 
                type: 'weekView',
                showWeekends: false,
                timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
                allDayRowHeight: 24,
                rowHeight: 12,
                showWorkTime : false,
            });
        }
        if (this.showViews.includes('dayView')) {
            this.views.push({ 
                type: 'dayView',
                showWeekends: false,
                timeRuler: { scaleStartHour: this.scaleStartHour, scaleEndHour: this.scaleEndHour },
                allDayRowHeight: 24,
                rowHeight: 8,
                showWorkTime : false,
            });
        }
    }
    getBookings() {
        let nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        console.log("RoomCalendarComponent::getBookings() compute next half hour : ", nextHour);
        this.bookingService.getBookings({ roomId: this.room.id, endAfter: nextHour }).subscribe(
            bookings => {
                this.myScheduler.beginAppointmentsUpdate();
                this.myScheduler.getAppointments().forEach(
                    appointment => {this.myScheduler.deleteAppointment(appointment.id as string);}
                );
                bookings.forEach(booking => {
                    let a = new Date(booking.startDate).valueOf();
                    let b= nextHour.valueOf();
                    if (new Date(booking.startDate).valueOf() < nextHour.valueOf()) {
                        console.log("RoomCalendarComponent::getBookings() trunk booking startDate ", nextHour);
                        booking.startDate = nextHour;
                    }
                    if (new Date(booking.startDate).valueOf() < new Date(booking.endDate).valueOf()) {
                        let appointment = this.booking2event(booking, this.room.name);
                        this.myScheduler.addAppointment(appointment);
                    }
                });

                // ADD a fake appointment for the past 7 days (useful in week view)
                for (let hour = this.scaleStartHour; hour < nextHour.getHours(); hour++) {
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
        let privateDatas: EventPrivateData = {
            id: booking.ref,
            title: booking.title,
            organization: booking.organization,
            roomId: booking.roomId,
            tag: 'unavailable',
            description: booking.details
        };
        return {
        id: booking.ref,
        subject: booking.startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
                    + "-" + booking.endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
        privateDatas: JSON.stringify(privateDatas),
        room: roomName,
        start: booking.startDate, // convert to local time
        end: booking.endDate, // convert to local time
        organization: booking.organization,
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
        let privateDatas: EventPrivateData = {
            id: 'fake-' + uuid(),
            title: '',
            organization: '',
            roomId: this.room.id,
            tag: 'fake',
            description: ''
        };
        return {
            id: 'fake'  + uuid(),
            subject: start.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
            + "-" + end.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
            privateDatas: JSON.stringify(privateDatas),
            organization: '',
            room: this.room.name,
            start: start, // convert to local time
            end: end, // convert to local time
        }
    }

     _previewEventId = '';
    getPreviewEvent(title:string, startDate: Date, endDate: Date) {
        if (!title || (title === ''))
            title = ' ';
        title += "\n" + startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
        + "-" + endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        let privateDatas: EventPrivateData = {
            id: 'fake-' + uuid(),
            title: title,
            organization: '',
            roomId: this.room.id,
            tag: 'preview',
            description: ''
        };
        return {
            id: title,
            subject: title,
            privateDatas: JSON.stringify(privateDatas),
            organization: '',
            room: this.room.name,
            start: startDate, // convert to local time
            end: endDate, // convert to local time
        };
    }

    previewEvent(title:string, startDate: Date, endDate: Date) {
        console.log("RoomCalendar::previewEvent() title=", title, "startDate=", startDate, "endDate=", endDate);
        this.myScheduler.deleteAppointment(this._previewEventId);
        this.myScheduler.addAppointment(
            this.getPreviewEvent(title, startDate, endDate)
        );
    }

    // setSelection(date: Date, startTime: number, endTime: number) {
    //     console.log("RoomCalendar::setSelection() date=", date, "startTime=", startTime, "endTime=", endTime);
    //     this.myScheduler.clearSelection();
    //     for (let hour = startTime; hour < endTime; hour += this.increment) {
    //         let jqxdate = new jqx.date(
    //             date.getFullYear(),
    //             date.getMonth() + 1, // getMonth(January) => 0
    //             date.getDate(),
    //             Math.floor(hour),
    //             60*(hour - Math.floor(hour))
    //         );
    //         console.log("jqxdate=", jqxdate.toDate());
    //         this.myScheduler.selectCell(jqxdate, false, '-1');
    //     }
    // }

    ngAfterViewInit() {
        this.myScheduler.beginAppointmentsUpdate();

        this.myScheduler.renderAppointment(data => {
            let privateDatas: EventPrivateData = JSON.parse(data.appointment.originalData.privateDatas);
            if (privateDatas.tag === 'fake') {
                data.style = "#BEBEBE"; // gray
                data.cssClass = "fake-event";
                data.html = "<div class='fake-event'></div>";
            } else if (privateDatas.tag === 'preview') {
                data.style = "#00008B"; // blue
                data.cssClass = "preview-event";
                // data.html = "<div class='preview-event'></div>";
            } else if (privateDatas.tag === 'unavailable') {
                data.style = "#8B0000"; // red
                data.cssClass = "unavailable-event";
                data.html = "<div class='unavailable-event'></div>";
            } else {
            }
            return data;
        });
        this.myScheduler.onAppointmentAdd.subscribe((event: any) => {
            let args = event.args;
            let appointment = args.appointment;
            let privateDatas: EventPrivateData = JSON.parse(appointment.originalData.privateDatas);
            if (privateDatas.tag === 'preview') {
                this._previewEventId = appointment.id;
            } else {
                this.myScheduler.setAppointmentProperty(appointment.id, 'resizable', !this.readOnly);
                this.myScheduler.setAppointmentProperty(appointment.id, 'draggable', !this.readOnly);
                this.myScheduler.setAppointmentProperty(appointment.id, 'readOnly', !this.readOnly);
                this.myScheduler.setAppointmentProperty(appointment.id, 'tooltip', '');
            }
        });
        this.myScheduler.onCellClick.subscribe((event: any) => {
            console.log("RoomCalendar::onCellClick() date=", event.args.date.toDate());
            let selection = this.myScheduler.getSelection();
            console.log("RoomCalendar::onCellClick() selection from=", selection.from.toDate(), "to=", selection.to.toDate(), "resource=", selection.ResourceId);
        });
        this.myScheduler.rendering(() => {
            console.log("RoomCalendar::rendering()");
        });
        this.myScheduler.rendered(() => {
            console.log("RoomCalendar::rendered()");
        });
        this.myScheduler.onContextMenuCreate.subscribe((event) => {
            console.log("RoomCalendar::onContextMenuCreate(), event=", event);
            event.args.menu.empty();
            return event;
        });
        this.myScheduler.onContextMenuOpen.subscribe((event) => {
            console.log("RoomCalendar::onContextMenuOpen(), event=", event);
            event.args.menu.empty();
            let selection = this.myScheduler.getSelection();
            if (selection && selection.from && selection.to) {
                console.log("RoomCalendar::onContextMenuOpen() selection from=", selection.from.toDate(), "to=", selection.to.toDate(), "resource=", selection.ResourceId);
            }
            this.validateSelection();
            return event;
        });
        this.myScheduler.onAppointmentChange.subscribe((event) => {
            let args = event.args;
            let appointment = args.appointment;
            let privateDatas: EventPrivateData = JSON.parse(appointment.originalData.privateDatas);
            if (privateDatas.tag === 'preview') {
                this.previewUpdated.emit({startDate: appointment.from.toDate(), endDate: appointment.to.toDate()});
            }
        });
        this.myScheduler.endAppointmentsUpdate();

    }
    @Output() selectionValidated = new EventEmitter();
    validateSelection() {
        let selection = this.myScheduler.getSelection();
        if (selection && selection.from && selection.to) {
            this.selectionValidated.emit({startDate: selection.from.toDate(), endDate: selection.to.toDate()});
        }
    }

    @Output() previewUpdated = new EventEmitter();

   _room: Room;
  set room(value: Room) {
      console.log("room calendar select room:", value.name);
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
  @Input()
  showViews = [];
//   @Input()
//   increment = 0.5;

  minDate = new jqx.date('todayDate'); // default is today

  
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
        localData: [],
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
        orientation: "horizontal",
        source: new jqx.dataAdapter(this.source)
    };
    views: any[] = [];
}
