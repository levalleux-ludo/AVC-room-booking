import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../_services/booking.service';
import { Booking, computeEndDate, duration } from '../../_model/booking';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Room } from '../../_model';
import { RoomService } from '../../_services/room.service';
import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { PdfCreatorService } from 'src/app/_services/pdf-creator.service';

export interface DurationInSelect {
  hour: number;
  minute: number;
  view: string
}

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class BookingDetailComponent implements OnInit {

  booking: Booking;
  room: Room;
  editable: boolean = false;
  durations: DurationInSelect[] = [
    {hour:1, minute:0, view:'1h'},
    {hour:1, minute:30, view:'1h30'},
    {hour:2, minute:0, view:'2h'},
    {hour:2, minute:30, view:'2h30'},
    {hour:3, minute:0, view:'3h'},
    {hour:3, minute:30, view:'3h30'},
    {hour:4, minute:0, view:'4h'},
    {hour:4, minute:30, view:'4h30'},
    {hour:5, minute:0, view:'5h'},
    {hour:5, minute:30, view:'5h30'},
    {hour:6, minute:0, view:'6h'},
    {hour:9, minute:0, view:'All Day'},
  ];
  _selectedDuration = this.durations[0];
  set selectedDuration(value) {
    this._selectedDuration = value;
    if (this._selectedDuration) {
      let duration = this._selectedDuration.hour + (this._selectedDuration.minute / 60);
      computeEndDate(this.booking, duration);
    }
  }
  get selectedDuration() {
    return this._selectedDuration;
  }


  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private location: Location, // required to get back in navigation history
    private bookingService: BookingService,
    private roomService: RoomService,
    private pdfCreatorService: PdfCreatorService
  ) { }

  ngOnInit() {
    const path = this.route.snapshot.routeConfig.path;
    if (path.endsWith('/create')) {
      this.editable = true;
      let roomId = this.route.snapshot.queryParams['roomId'];
      if (roomId) this.getRoom(roomId);
      this.booking = this.bookingService.getEmptyBooking();
    } else {
      const bookingId = this.route.snapshot.paramMap.get('id');
      this.getBooking(bookingId);
    }
  }

  getBooking(id: string) {
    this.bookingService.getBooking(id).subscribe(
      booking => {
        this.booking = new Booking(booking);
        this.getRoom(this.booking.roomId);
        this.selectedDuration = this.findDuration(duration(booking));
        this.bookingService.getBookingPrivateData(booking.privateData).subscribe((privateData) => {
          this.booking.privateDataRef = privateData;
          this.createPDF();
        });
        // TODO set _selectedDuration
        // TODO set _startTimeHours
      }
    );
  }

  private findDuration(duration: number): DurationInSelect {
    let ent = Math.floor(duration);
    let dec = duration - ent;
    if (dec < 0.5) dec = 0;
    else dec = 30;
    return this.durations.find(duration => (duration.hour === ent) && (duration.minute === dec));
  }

  getRoom(roomId) {
    this.roomService.getRoomFromId(roomId).subscribe(
      room => {
        this.room = new Room(room);
        this.booking.roomId = this.room.id;
      }
    );
  }

  goBack() {
    this.location.back();
  }

  save() {
    // this.bookingService.createBooking(this.booking).subscribe(
    //   booking => { if(booking) {
    //       console.log("Booking created", booking);
    //       this.goBack();
    //     }
    //   });
  }

  get startTimeHour(): number {
    if (this.booking) {
      if (this.booking.startDate as Date)
        return this.booking.startDate.getHours();
      else
        return new Date(this.booking.startDate).getHours();
    }
    return 0;
  }
  set startTimeHour(value: number) {
    if (this.booking) {
      this.booking.startDate = new Date(
        this.booking.startDate.getFullYear(),
        this.booking.startDate.getMonth(),
        this.booking.startDate.getDate(),
        value,
        this.booking.startDate.getMinutes()
      );
    }
  }
  get startTimeMinute(): number {
    if (this.booking) {
      if (this.booking.startDate as Date)
        return this.booking.startDate.getMinutes();
      else
        return new Date(this.booking.startDate).getMinutes();
    }
    return 0;
  }
  set startTimeMinute(value: number) {
    if (this.booking) {
      this.booking.startDate = new Date(
        this.booking.startDate.getFullYear(),
        this.booking.startDate.getMonth(),
        this.booking.startDate.getDate(),
        this.booking.startDate.getHours(),
        value
      );
    }
  }

  duration (booking: Booking) {
    duration(booking);
  }

  createPDF() {
    this.pdfCreatorService.createBookingForm(this.booking, this.booking.privateDataRef).then((pdfData) => pdfData.open());
  }
}
