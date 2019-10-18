import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Room } from '../model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { PriceDisplayComponent } from '../price-display/price-display.component';


@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit {
  form: FormGroup;

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;
  @ViewChild('startTimePicker', {static: false}) startTimePicker: TimePickerComponent;
  @ViewChild('endTimePicker', {static: false}) endTimePicker: TimePickerComponent;
  @ViewChild('price', {static: false}) priceDisplay: PriceDisplayComponent;

  _selectedRoom: Room;
  availableExtras = [
    {extra: 'flipchart_paper_pens', defaultRate: 5.5 },
    {extra: 'projector_screen', defaultRate: 5.5},
    {extra: 'refreshment_fullDay', defaultRate: 15.5},
    {extra: 'refreshment_halfDay', defaultRate: 10}
  ];
  actualBookings: Booking[] = [];
  unavailableStartHours: number[] = [];
  unavailableEndHours: number[] = [];
  increment = 0.5;
  minTime = 8;
  maxTime = 20;
  today = new Date();

  _selectedExtras: any[] = [];
  set selectedExtras(value: any[]) {
    console.log("BookingDialogCOmponent::selectedExtras() ", value);
    this._selectedExtras = value;
    if (this.priceDisplay) {
      this.priceDisplay.extras = {};
    }
    for (let extra of this._selectedExtras) {
      this.priceDisplay.extras[extra.extra] = extra.defaultRate;
    }
  }
  get selectedExtras() {
    return this._selectedExtras;
  }


  get selectedRoom(): Room {
    return this._selectedRoom;
  }
  set selectedRoom(value: Room) {
    this._selectedRoom = value;
    if (this._selectedRoom) {
      this.bookingService.getBookings({roomId: this._selectedRoom.id, endAfter:(new Date())}).subscribe(
        bookings => {
          this.actualBookings = bookings;
          if (this.selectedDate) {
            this.computeUnavailableHours();
            if (this.checkConflicts(this.startDate, this.endDate)) {
              console.log("BookingDialogComponent::onSelectedDateChanged() unset startTime/endTime because the new date dont match the availabilities")
              this.unsetTimePickers();
            }
            this.updateCalendar();
          }
        }
      )
    }

  }

  unsetTimePickers() {
      try {
        this.startTimePicker.setHourWithoutNotification(undefined);
      this._startTime = undefined;
      this.form.patchValue({startDate: undefined});
      this.startTimePicker.setHourWithoutNotification(undefined);
      this._endTime = undefined;
      this.form.patchValue({endDate: undefined});
    } catch (e) {
      console.error(e);
    }
  }

  get selectedDate(): Date {
    return this.form.value.date;
  }
  onSelectedDateChanged() {
    this.computeUnavailableHours();
    // If the current selected time slot in not available anymore with the new date, unset it
    if (this.checkConflicts(this.startDate, this.endDate)) {
        console.log("BookingDialogComponent::onSelectedDateChanged() unset startTime/endTime because the new date dont match the availabilities");
        this.unsetTimePickers();
    }
    // this.startTime = this.validateStartTime(this._startTime, this._startTime);
    // this.endTime = this.validateEndTime(this._endTime, this._endTime);
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


  getActualDateBookings(actualDate: Date): Booking[] {
    let actualDateBookings: Booking[] = [];
    if (this.actualBookings) {
        actualDateBookings = this.actualBookings.filter(
          booking => {
            return this.compareDateSameDay(booking.startDate, actualDate);
          });
    }
    return actualDateBookings;
  }

  computeUnavailableHours() {
    if (!this.selectedDate) return;
    let actualDateBookings = this.getActualDateBookings(this.selectedDate);

    this.unavailableStartHours = [];
    this.unavailableEndHours = [];
    let now = new Date();
    if (this.compareDateSameDay(this.selectedDate, now)) {
      let currentTime = this.getTimeFromDate(now);
      // if Today is selected, disable all hours before current time
      for (let time = this.minTime; time <= currentTime; time += this.increment) {
        this.unavailableStartHours.push(time);
        this.unavailableEndHours.push(time);
      }
    }
    for (let booking of actualDateBookings) {
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

  startTimeChanged(event: any) { // this event is raised when the user select another time in time-picker
    console.log("BookingDialogComponent::startTimeChanged()", event);
    this._startTime = event;
    if (this.endTime <= this.startTime) {
      for (let endTime = this.startTime + this.increment; endTime <= this.maxTime; endTime += this.increment) {
        if (!this.unavailableEndHours.includes(endTime)) {
          this.endTime = endTime;
          break;
        }
      }
    }
    this.form.patchValue({startDate: this.startDate});
    this.updateCalendar();
  }
  endTimeChanged(event: any) { // this event is raised when the user select another time in time-picker
    console.log("BookingDialogComponent::endTimeChanged()", event);
    this._endTime = event;
    if (this.startTime >= this._endTime) {
      for (let startTime = this.endTime - this.increment; startTime >= this.minTime; startTime -= this.increment) {
        if (!this.unavailableStartHours.includes(startTime)) {
          this.startTime = startTime;
          break;
        }
      }
    }
    this.form.patchValue({endDate: this.endDate});
    this.updateCalendar();
  }

  _startTime: number = this.minTime;
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
      this.updateCalendar();
      if (this.startTimePicker) {
        this.startTimePicker.setHourWithoutNotification(this._startTime);
      }
      if (this.endTimePicker) {
        this.endTimePicker.setHourWithoutNotification(this._endTime);
      }
    }
  }
  validateStartTime(newValue: number, oldValue: number): number {
    // if (!newValue) return undefined;
    // if (newValue >= this.maxTime) {
    //   newValue = this.maxTime - this.increment;
    // }
    // if (newValue < this.minTime) {
    //   newValue = this.minTime;
    // }
    // if (this.unavailableStartHours.includes(newValue)) {
    //   for (let hour = this.minTime; hour < this.maxTime; hour += this.increment) {
    //     if (!this.unavailableStartHours.includes(hour)) {
    //       console.log("BookingDialogComponent::validateStartTime() new startTime", newValue, "is not allowed. Return ", hour);
    //       return hour;
    //     }
    //   }
    //   return undefined;
    // }
    // console.log("BookingDialogComponent::validateStartTime() old startTime=", oldValue, ", new startTime=", newValue);
    return newValue;
  }

  _endTime: number = this.minTime + this.increment;
  get endTime() {
    return this._endTime;
  }
  set endTime(value: number) {
    if (this._endTime !== value) {
      let oldEndTime = this._endTime;
      this._endTime = this.validateEndTime(value, oldEndTime);
      // if (this._startTime >= this._endTime) {
      //   this._startTime = this._endTime - this.increment;
      // }
      // this._startTime = this.validateStartTime(this._startTime, this._startTime);
      this.updateCalendar();
      if (this.endTimePicker) {
        this.endTimePicker.hour = this._endTime;
      }
    }
  }
  validateEndTime(newValue: number, oldValue: number): number {
    // if (!newValue) return undefined;
    // if (newValue > this.maxTime) {
    //   newValue = this.maxTime;
    // }
    // if (newValue <= this.minTime) {
    //   newValue = this.minTime + this.increment;
    // }
    // if (this.unavailableEndHours.includes(newValue)) {
    //   for (let hour = this.minTime + this.increment; hour < this.maxTime; hour += this.increment) {
    //     if (!this.unavailableEndHours.includes(hour)) {
    //       console.log("BookingDialogComponent::validateEndTime() new endTime", newValue, "is not allowed. Return ", hour);
    //       return hour;
    //     }
    //   }
    //   return undefined;
    // }
    // console.log("BookingDialogComponent::validateEndTime() old endTime=", oldValue, ", new endTime=", newValue);
    return newValue;

  }

  getTimeFromDate(date: Date): number {
    return date.getHours() + (date.getMinutes() / 60);
  }

  checkConflicts(startDate: Date, endDate: Date): boolean {
    let actualDateBookings = this.getActualDateBookings(startDate);
    for (let booking of actualDateBookings) {
      if ((booking.startDate < endDate) && (booking.endDate > startDate)) {
        console.log("BookingDialogComponent::checkConflicts() conflict found with event ", booking);
        return true;
      }
    }
    return false;
  }

  validateHours(startTime: number, endTime: number): {valid: boolean, startTime: number, endTime: number} {
    // if (this.unavailableStartHours.includes(startTime)) {
    //   return {valid: false, startTime: 0, endTime: 0};
    // }
    // if (this.unavailableEndHours.includes(endTime)) {
    //   return {valid: false, startTime: 0, endTime: 0};
    // }
    if (startTime < this.minTime) {
      startTime = this.minTime;
    }
    if (endTime > this.maxTime) {
      endTime = this.maxTime;
    }
    return {valid: true, startTime: startTime, endTime: endTime};
  }
  OnCalendarPreviewUpdated(event: {startDate: Date, endDate: Date}) {
    console.log("BookingDialogComponent::OnCalendarPreviewUpdated, event", event);
    let date: number = new Date(event.startDate).setHours(0,0,0,0);
    if (!this.checkConflicts(event.startDate, event.endDate)) {
      let {valid, startTime, endTime} = this.validateHours(this.getTimeFromDate(event.startDate), this.getTimeFromDate(event.endDate));
      if (valid) {
        this.shallUpdateCalendar = false;
        this.form.patchValue({date: new Date(date)});
        this.onSelectedDateChanged();
        // this.startTime = this.validateStartTime(startTime, this._startTime);
        this.startTime = startTime;
        // this.endTime = this.validateEndTime(endTime, this._endTime);
        this.endTime = endTime;
        this.form.patchValue({startDate: this.startDate});
        this.form.patchValue({endDate: this.endDate});
        this.shallUpdateCalendar = true;  
      }
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
          organization: '',
          description: '',
          room: this.selectedRoom,
          extras: new FormControl(),
          date: new FormControl(),
          startDate: new FormControl('', [Validators.required]),
          endDate: new FormControl('', [Validators.required])
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

  datePickerFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

}
