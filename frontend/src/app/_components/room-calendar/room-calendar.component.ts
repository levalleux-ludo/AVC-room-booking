import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Room } from '../../_model';
import { jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler';
import { BookingService } from '../../_services/booking.service';
import { Booking } from '../../_model/booking';
import { RoomService } from '../../_services/room.service';
import { AbstractCalendarComponent } from '../abstract-calendar/abstract-calendar.component';



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
export class RoomCalendarComponent extends AbstractCalendarComponent implements OnInit, AfterViewInit {

    constructor(
        protected bookingService: BookingService,
        protected roomService: RoomService
    )
    {
        super(bookingService, roomService);
     }

    ngOnInit() {
        this.createViews();
    }

    getBookingFilter() {
        let nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        console.log("RoomCalendarComponent::getBookings() compute next half hour : ", nextHour);
        return { roomId: this.room.id, endAfter: nextHour };
    }

    processBooking(booking): Booking {
        let nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        let a = new Date(booking.startDate).valueOf();
        let b= nextHour.valueOf();
        if (new Date(booking.startDate).valueOf() < nextHour.valueOf()) {
            console.log("RoomCalendarComponent::getBookings() trunk booking startDate ", nextHour);
            booking.startDate = nextHour;
        }
        return booking;
    }

    booking2event(booking: Booking) {
        let appointment = super.booking2event(booking);
        appointment.subject = booking.startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
                  + "-" + booking.endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        return appointment;
    }

    afterBookingFetched() {
        let nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        // ADD a fake appointment for the past 7 days (useful in week view)
        for (let hour = this.scaleStartHour; hour < nextHour.getHours(); hour++) {
            this.myScheduler.addAppointment(this.getFakeEvent(0, hour));
        }
        for (let pastDay = 1; pastDay < 8; pastDay++) {
            for (let hour = this.scaleStartHour; hour <= this.scaleEndHour; hour++) {
                this.myScheduler.addAppointment(this.getFakeEvent(pastDay, hour));
            }
        }
        // ADD preview event if defined
        if (this.lastPreviewEvent) {
            this.previewEvent(this.lastPreviewEvent.title, this.lastPreviewEvent.startDate, this.lastPreviewEvent.endDate);
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

    lastPreviewEvent: {title:string, startDate: Date, endDate: Date};
    previewEvent(title:string, startDate: Date, endDate: Date) {
        console.log("RoomCalendar::previewEvent() title=", title, "startDate=", startDate, "endDate=", endDate);
        this.lastPreviewEvent = {title:title, startDate:startDate, endDate:endDate};
        this.myScheduler.deleteAppointment(this._previewEventId);
        this.myScheduler.addAppointment(
            this.getPreviewEvent(title, startDate, endDate)
        );
    }

    onAppointmentAdd(appointment, privateDatas: EventPrivateData) {
        if (privateDatas.tag === 'preview') {
            this._previewEventId = appointment.id;
        } else {
            super.onAppointmentAdd(appointment, privateDatas);
        }
      }

    configureScheduler() {
        this.myScheduler.beginAppointmentsUpdate();
        super.configureScheduler(false);

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

    ngAfterViewInit() {
        this.configureScheduler();
    }

    // selectionValidated : raised when a selection is 'validated', ie the user right-click after selecting several cells
    @Output() selectionValidated = new EventEmitter();
    validateSelection() {
        let selection = this.myScheduler.getSelection();
        if (selection && selection.from && selection.to) {
            this.selectionValidated.emit({startDate: selection.from.toDate(), endDate: selection.to.toDate()});
        }
    }

    // previewUpdated is raised after the user changes the preview event (drag or resize)
    @Output() previewUpdated = new EventEmitter();

    // the room to which the calendar is referring to
    _room: Room;
    set room(value: Room) {
        console.log("room calendar select room:", value.name);
        this._room = value;
        this.getRooms(this._room);
        this.getBookings();
    }

    @Input()
    get room():Room {
        return this._room;
    }

//   @Input()
//   scaleStartHour = 7;
//   @Input()
//   scaleEndHour = 21;
//   @Input()
//   disabled = false;
//   @Input()
//   readOnly = false;
//   @Input()
//   showViews = [];
//   @Input()
//   height = 400;
//   @Input()
//   width = 500;
//   @Input()
//   increment = 0.5;

    minDate = new jqx.date('todayDate'); // default is today


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
}
