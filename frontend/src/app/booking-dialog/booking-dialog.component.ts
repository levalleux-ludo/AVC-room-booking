import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Room } from '../model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';


@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit {
  form: FormGroup;

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;

  _selectedRoom: Room;
  actualBookings: Booking[] = [];
  actualDateBookings: Booking[] = [];
  unavailableStartHours: number[] = [];
  unavailableEndHours: number[] = [];
  increment = 0.5;
  today = new Date();
  get selectedRoom(): Room {
    return this._selectedRoom;
  }
  set selectedRoom(value: Room) {
    this._selectedRoom = value;
    if (this._selectedRoom) {
      this.bookingService.getBookings({roomId: this._selectedRoom.id, endAfter:(new Date())}).subscribe(
        bookings => {
          this.actualBookings = bookings;
          this.getActualDateBookings();
        }
      )
    }

  }

  onSelectedDateChanged() {
    let actualDate = this.form.value.date;
    console.log("BookingDialogComponent::onSelectedDateChanged() actualDate=", actualDate);
    this.getActualDateBookings();
    this.startTime = this.validateStartTime(this._startTime, this._startTime);
    this.endTime = this.validateEndTime(this._endTime, this._endTime);
    this.updateCalendar();
  }

  compareDateSameDay(date1: Date, date2: Date): boolean {
    if (date1 && date2) {
      return (date1.getFullYear() === date2.getFullYear())
          && (date1.getMonth() === date2.getMonth())
          && (date1.getDate() === date2.getDate());
    }
    return date1 === date2;
  }


  getActualDateBookings() {
    if (this.actualBookings) {
      let actualDate: Date = this.form.value.date;
      this.actualDateBookings = this.actualBookings.filter(booking => {
        return this.compareDateSameDay(booking.startDate, actualDate);
      });
      console.log("BookingDialogComponent::getActualDateBookings() actualDate=", actualDate, ", found bookings=", this.actualDateBookings);
      this.unavailableStartHours = [];
      this.unavailableEndHours = [];
      let now = new Date();
      if (this.compareDateSameDay(actualDate, now)) {
        let currentTime = this.getTimeFromDate(now);
        // if Today is selected, disable all hours before current time
        for (let time = this.minTime; time <= currentTime; time += this.increment) {
          this.unavailableStartHours.push(time);
          this.unavailableEndHours.push(time);
        }
      }
      for (let booking of this.actualDateBookings) {
        let startTime = this.getTimeFromDate(booking.startDate);
        let endTime = this.getTimeFromDate(booking.endDate);
        this.unavailableStartHours.push(startTime);
        this.unavailableEndHours.push(endTime);
        for (let time = startTime + this.increment; time < endTime; time += this.increment) {
          this.unavailableStartHours.push(time);
          this.unavailableEndHours.push(time);
        }
      }
    }
  }

  minTime = 8;
  maxTime = 19;

  shallUpdateCalendar = true;
  updateCalendar() {
    if (this.calendar && this.shallUpdateCalendar) {
      this.calendar.previewEvent(this.form.value.title, this.startDate, this.endDate);
    }
  }

  get startDate(): Date {
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.startTime));
    date.setMinutes(60 * (this.startTime - Math.floor(this.startTime)) );
    return date;
  }

  get endDate(): Date {
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.endTime));
    date.setMinutes(60 * (this.endTime - Math.floor(this.endTime)) );
    return date;
  }

  _startTime: number;
  get startTime() {
    return this._startTime;
  }
  set startTime(value: number) {
    if (this._startTime !== value) {
      console.log("BookingDialogComponent::set startTime()", value);
      let oldStartTime = this._startTime;
      this._startTime = this.validateStartTime(value, oldStartTime);
      let oldEndTime = this._endTime;
      if (this._endTime <= this._startTime) {
        this._endTime = this._startTime + (oldEndTime - oldStartTime);
      }
      this._endTime = this.validateEndTime(this._endTime, this._endTime);
      this.updateCalendar();
    }
  }
  validateStartTime(newValue: number, oldValue: number): number {
    if (!newValue) return undefined;
    if (newValue >= this.maxTime) {
      newValue = this.maxTime - this.increment;
    }
    if (newValue < this.minTime) {
      newValue = this.minTime;
    }
    if (this.unavailableStartHours.includes(newValue)) {
      for (let hour = this.minTime; hour < this.maxTime; hour += this.increment) {
        if (!this.unavailableStartHours.includes(hour)) {
          console.log("BookingDialogComponent::validateStartTime() new startTime", newValue, "is not allowed. Return ", hour);
          return hour;
        }
      }
      return undefined;
    }
    console.log("BookingDialogComponent::validateStartTime() old startTime=", oldValue, ", new startTime=", newValue);
    return newValue;
  }

  _endTime: number;
  get endTime() {
    return this._endTime;
  }
  set endTime(value: number) {
    if (this._endTime !== value) {
      let oldEndTime = this._endTime;
      this._endTime = this.validateEndTime(value, oldEndTime);
      if (this._startTime >= this._endTime) {
        this._startTime = this._endTime - this.increment;
      }
      this._startTime = this.validateStartTime(this._startTime, this._startTime);
      this.updateCalendar();
    }
  }
  validateEndTime(newValue: number, oldValue: number): number {
    if (!newValue) return undefined;
    if (newValue > this.maxTime) {
      newValue = this.maxTime;
    }
    if (newValue <= this.minTime) {
      newValue = this.minTime + this.increment;
    }
    if (this.unavailableEndHours.includes(newValue)) {
      for (let hour = this.minTime + this.increment; hour < this.maxTime; hour += this.increment) {
        if (!this.unavailableEndHours.includes(hour)) {
          console.log("BookingDialogComponent::validateEndTime() new endTime", newValue, "is not allowed. Return ", hour);
          return hour;
        }
      }
      return undefined;
    }
    console.log("BookingDialogComponent::validateEndTime() old endTime=", oldValue, ", new endTime=", newValue);
    return newValue;

  }

  getTimeFromDate(date: Date): number {
    return date.getHours() + (date.getMinutes() / 60);
  }

  checkConflicts(startDate: Date, endDate: Date): boolean {
    this.actualDateBookings.forEach(booking => {
      if ((booking.startDate < endDate) && (booking.endDate > startDate)) {
        console.log("BookingDialogComponent::checkConflicts() conflict found with event ", booking);
        return true;
      }
    })
    return false;
  }

  OnCalendarPreviewUpdated(event: {startDate: Date, endDate: Date}) {
    console.log("BookingDialogComponent::OnCalendarPreviewUpdated, event", event);
    let startTime: number = this.getTimeFromDate(event.startDate);
    let endTime: number = this.getTimeFromDate(event.endDate);
    let date: number = new Date(event.startDate).setHours(0,0,0,0);
    if (!this.checkConflicts(event.startDate, event.endDate)) {
      this.shallUpdateCalendar = false;
      this.form.patchValue({date: new Date(date)});
      this.onSelectedDateChanged();
      this.startTime = this.validateStartTime(startTime, this._startTime);
      this.endTime = this.validateEndTime(endTime, this._endTime);
      this.shallUpdateCalendar = true;
    }
    this.updateCalendar();
  }

  startTimeChangeRequest(event: any) {
    console.log("BookingDialogComponent::startTimeChangeRequest() event=", event);
  }

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<BookingDialogComponent>,
      private bookingService: BookingService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.selectedRoom = this.data.room;
      }

  ngOnInit() {
      this.form = this.fb.group({
          title: '',
          organization: 'Company#3',
          room: this.selectedRoom,
          date: new FormControl(),
          startDate: new FormControl(),
          endDate: new FormControl()
       });
       this.onSelectedDateChanged();
  }

  submit(form) {
      form.patchValue({startDate: this.startDate});
      form.patchValue({endDate: this.endDate});
      this.dialogRef.close(form.value);
  }

  compareRooms(room1: Room, room2: Room): boolean {
    if(room1 && room2) {
      return room1.id === room2.id
     } else {
      return room1 === room2
     }
  }

}
