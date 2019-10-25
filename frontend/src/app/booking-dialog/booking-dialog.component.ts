import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from "@angular/material";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Room } from '../model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { ExtraService } from '../_services/extra.service';
import { Extra } from '../model/extra';
import { Observable, Subscription } from 'rxjs';
import { Organization } from '../model/organization';


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
  availableExtras = [];
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
    this.updatePrice();
  }
  get selectedExtras() {
    return this._selectedExtras;
  }

  updatePrice() {
    if (this.priceDisplay) {
      this.priceDisplay.roomRatePerHour = this.selectedRoom.rentRateHour;

      let durationMS = this.endDate.valueOf() - this.startDate.valueOf();
      let durationHour = durationMS/(1000*60*60);
      this.priceDisplay.hourQuantity = durationHour;

      this.priceDisplay.extras = {};
      for (let extraId of this._selectedExtras) {
        let extra = this.getExtraFromId(extraId);
        this.priceDisplay.extras[extra.name] = extra.defaultRate;
      }
    }

  }

  getExtraFromId(extraId): Extra {
    return this.extraService.getExtraFromId(extraId);
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
            this.updatePrice();
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
      this.updatePrice();
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
      let currentTime = BookingDialogComponent.getTimeFromDate(now);
      // if Today is selected, disable all hours before current time
      for (let time = this.minTime; time <= currentTime; time += this.increment) {
        this.unavailableStartHours.push(time);
        this.unavailableEndHours.push(time);
      }
    }
    for (let booking of actualDateBookings) {
      let startTime = BookingDialogComponent.getTimeFromDate(booking.startDate);
      let endTime = BookingDialogComponent.getTimeFromDate(booking.endDate);
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
    this.updatePrice();
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
    this.updatePrice();
  }

  _startTime: number = this.minTime;
  get startTime() {
    return this._startTime;
  }
  set startTime(value: number) {
    if (this._startTime !== value) {
      console.log("BookingDialogComponent::set startTime()", value);
      let oldStartTime = this._startTime;
      this._startTime = value;
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

  _endTime: number = this.minTime;
  get endTime() {
    return this._endTime;
  }
  set endTime(value: number) {
    if (this._endTime !== value) {
      let oldEndTime = this._endTime;
      this._endTime = value;
      this.updateCalendar();
      if (this.endTimePicker) {
        this.endTimePicker.hour = this._endTime;
      }
    }
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
      let {valid, startTime, endTime} = this.validateHours(BookingDialogComponent.getTimeFromDate(event.startDate), BookingDialogComponent.getTimeFromDate(event.endDate));
      if (valid) {
        this.shallUpdateCalendar = false;
        this.form.patchValue({date: new Date(date)});
        this.onSelectedDateChanged();
        this.startTime = startTime;
        this.endTime = endTime;
        this.form.patchValue({startDate: this.startDate});
        this.form.patchValue({endDate: this.endDate});
        this.updatePrice();
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
      private extraService: ExtraService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      }

  ngOnInit() {
    this.selectedRoom = this.data.room;
    this.selectedExtras = this.data.extras;
    this.form = this.fb.group({
          title: this.data.title,
          organization: this.data.organization,
          description: this.data.description,
          room: this.selectedRoom,
          extras: new FormControl(this.data.extras),
          date: new FormControl(),
          startDate: new FormControl(this.data.startDate, [Validators.required]),
          endDate: new FormControl(this.data.endDate, [Validators.required]),
          totalPrice: 0
       });
       // this.onSelectedDateChanged();
       this.OnCalendarPreviewUpdated({startDate: this.data.startDate, endDate: this.data.endDate});
       this.extraService.refreshExtras();
  }

  submit(form) {
      form.patchValue({startDate: this.startDate});
      form.patchValue({endDate: this.endDate});
      form.patchValue({totalPrice: this.priceDisplay.totalPrice});
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

  static editBooking(
    dialog: MatDialog,
     service: (booking: Booking) => Observable<Booking>,
     then:(Booking) => void,
     organizations: Organization[],
      rooms: Room[],
      booking: Booking,
       room?: Room): Subscription {

        if (!room && booking.roomId) {
          room = rooms.find(room => room.id === booking.roomId);
        }
        let organization = organizations.find(org => org.id === booking.organizationId);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: booking.title,
      organization: organization,
      description: booking.details,
      // room: this.room.name,
      room: room,
      extras: booking.extras,
      startDate: booking.startDate,
      endDate: booking.endDate,
      organizations: organizations,
      rooms: rooms,
      // rooms: this.rooms.map(room => room.name),
    }

    const dialogRef = dialog.open(BookingDialogComponent, dialogConfig);
    return dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        booking.title = data.title;
        booking.details = data.description;
        booking.organizationId = data.organization.id;
        booking.roomId = data.room.id;
        booking.startDate = data.startDate;
        booking.endDate = data.endDate;
        booking.extras = data.extras;
        booking.totalPrice = data.totalPrice;
        service(booking).subscribe(
          newBooking => then(newBooking)
        );
      }
    );
  }

  static getTimeFromDate(date: Date): number {
    return date.getHours() + (date.getMinutes() / 60);
  }

}
