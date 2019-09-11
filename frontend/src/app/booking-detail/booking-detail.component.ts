import { Component, OnInit } from '@angular/core';
import { BookingService } from '../_services/booking.service';
import { Booking, computeEndTime } from '../model/booking';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Room } from '../model';
import { RoomService } from '../_services/room.service';
import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
    this.booking.duration = this._selectedDuration.hour + (this._selectedDuration.minute / 60);
    computeEndTime(this.booking);
  }
  get selectedDuration() {
    return this._selectedDuration;
  }


  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private location: Location, // required to get back in navigation history
    private bookingService: BookingService,
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    const path = this.route.snapshot.routeConfig.path;
    if (path.endsWith('/create')) {
      this.editable = true;
      let roomId = this.route.snapshot.queryParams['roomId'];
      if (roomId) this.getRoom(roomId);
      this.booking = this.bookingService.getEmptyBooking();
    } else {
      const ref = this.route.snapshot.paramMap.get('ref');
      this.getBooking(ref);
    }
  }

  getBooking(ref: string) {
    this.bookingService.getBooking(ref).subscribe(
      booking => {
        this.booking = booking;
        this.getRoom(this.booking.roomId);
        this.selectedDuration = this.findDuration(booking.duration);
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
        this.room = room;
        this.booking.roomId = this.room.id;
      }
    );
  }

  goBack() {
    this.location.back();
  }

  save() {
    this.bookingService.createBooking(this.booking).subscribe(
      booking => { if(booking) {
          console.log("Booking created", booking);
          this.goBack();
        }
      });
  }

  get startTimeHour(): number {
    if (this.booking) {
      if (this.booking.startTime as Date)
        return this.booking.startTime.getHours();
      else
        return new Date(this.booking.startTime).getHours();
    }
    return 0;
  }
  set startTimeHour(value: number) {
    if (this.booking) {
      this.booking.startTime = new Date(
        this.booking.startTime.getFullYear(),
        this.booking.startTime.getMonth(),
        this.booking.startTime.getDate(),
        value,
        this.booking.startTime.getMinutes()
      );
    }
  }
  get startTimeMinute(): number {
    if (this.booking) {
      if (this.booking.startTime as Date)
        return this.booking.startTime.getMinutes();
      else
        return new Date(this.booking.startTime).getMinutes();
    }
    return 0;
  }
  set startTimeMinute(value: number) {
    if (this.booking) {
      this.booking.startTime = new Date(
        this.booking.startTime.getFullYear(),
        this.booking.startTime.getMonth(),
        this.booking.startTime.getDate(),
        this.booking.startTime.getHours(),
        value
      );
    }
  }
}
