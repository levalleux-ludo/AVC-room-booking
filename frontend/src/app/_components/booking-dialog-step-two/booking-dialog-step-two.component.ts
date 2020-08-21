import { Component, OnInit, Input, Output, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Room } from 'src/app/_model';
import { BookingService } from 'src/app/_services/booking.service';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { Booking, RecurrencePatternParams } from 'src/app/_model/booking';
import { BookingDialogComponent, DateInPastErrorMatcher } from '../booking-dialog/booking-dialog.component';
import { Extra } from 'src/app/_model/extra';
import { eOrganizationType } from 'src/app/_model/organization';
import { RecurrencePatternDialogComponent, recurrencePattern2String } from '../recurrence-pattern-dialog/recurrence-pattern-dialog.component';
import { ExtraService } from 'src/app/_services/extra.service';
import { RecurrentEventService } from 'src/app/_services/recurrent-event.service';
import { BookingsConfigService } from 'src/app/_services/bookings-config.service';

@Component({
  selector: 'app-booking-dialog-step-two',
  templateUrl: './booking-dialog-step-two.component.html',
  styleUrls: ['./booking-dialog-step-two.component.scss']
})
export class BookingDialogStepTwoComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;
  @ViewChild('startTimePicker', {static: false}) startTimePicker: TimePickerComponent;
  @ViewChild('endTimePicker', {static: false}) endTimePicker: TimePickerComponent;
  @ViewChild('price', {static: false}) priceDisplay: PriceDisplayComponent;
  @ViewChild('dateInput', {static: false}) dateInput: ElementRef;

  @Input()
  readOnly: boolean;

  @Input()
  isCharity: boolean = false;

  _form: FormGroup;
  _selectedRoom: Room;
  shallUpdateCalendar = true;
  _startTime: number = 0;
  _endTime: number = 0;
  availableExtras = [];
  actualBookings: Booking[] = [];
  unavailableStartHours: number[] = [];
  unavailableEndHours: number[] = [];
  increment = 0.5;
  minTime = 8;
  maxTime = 20;
  today = new Date();
  recurrencePattern: RecurrencePatternParams = undefined;
  nextOccurrences: Date[] = [];
  errorMatcher = new DateInPastErrorMatcher();
  _selectedExtras: any[] = [];

  @Output()
  get isValid() {
    return this.form.valid;
  }

  @Output()
  get form() {
    return this._form;
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private extraService: ExtraService,
    private recurrencePatternService: RecurrentEventService,
    private bookingsConfigService: BookingsConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedRoom = this.data.room;
    this._form = this.fb.group({
      id: this.data.id,
      title: this.data.title,
      description: this.data.description,
      nbPeopleExpected: this.data.nbPeopleExpected,
      room: this.selectedRoom,
      extras: new FormControl(this.data.extras),
      date: new FormControl(this.data.date, [Validators.required]),
      startDate: new FormControl(this.data.startDate, [Validators.required]),
      endDate: new FormControl(this.data.endDate, [Validators.required]),
      totalPrice: new FormControl(0),
      isRecurrent: new FormControl(this.data.isRecurrent),
      recurrencePatternId: new FormControl(this.data.recurrencePatternId)
    }, { validators: [this.dateInPastValidator, (form: FormGroup) => {
      if (this.form && this.checkConflicts(this.startDate, this.endDate)) {
        return { timeSlotHasConflict: true };
      }
      return null;
    }] });
  }

  ngAfterViewInit(): void {
    if (this.startTimePicker) {
      this.startTimePicker.setHourWithoutNotification(this._startTime);
    }
    if (this.endTimePicker) {
      this.endTimePicker.setHourWithoutNotification(this._endTime);
    }
    this.OnCalendarPreviewUpdated({startDate: this.data.startDate, endDate: this.data.endDate});
    this.extraService.refreshExtras();
  }

  ngOnInit() {

    const newBooking = !this.data.id;
    this.selectedExtras = this.data.extras;
    this.startTime = BookingDialogComponent.getTimeFromDate(this.data.startDate);
    this.endTime = BookingDialogComponent.getTimeFromDate(this.data.endDate);

    if ((this.data.recurrencePatternId !== undefined) && (this.data.recurrencePatternId !== null)){
      this.bookingService.getRecurrencePattern(this.data.recurrencePatternId).subscribe(pattern => {
        pattern.endDate = new Date(pattern.endDate);
        this.recurrencePattern = pattern;
        const monthlyMode = pattern.dayInMonth > 0 ? 'day' : 'week';
        this.nextOccurrences = this.recurrencePatternService.computeOccurrences(pattern, this.startDate, monthlyMode);
      });
    }

    this.bookingsConfigService.get().subscribe((bookingsConfig) => {

      if (newBooking) {
        this.minTime = bookingsConfig.startTime;
        this.maxTime = bookingsConfig.endTime;
      } else {
        this.minTime = Math.min(bookingsConfig.startTime, this.startTime);
        this.maxTime = Math.max(bookingsConfig.endTime, this.endTime);
      }
    });
  }

  get selectedDate(): Date {
    return this.form.value.date;
  }

  get selectedRoom(): Room {
    return this._selectedRoom;
  }
  set selectedRoom(value: Room) {
    this._selectedRoom = value;
    if (this._selectedRoom) {
      this.bookingService.getBookings({cancelled: false, roomId: this._selectedRoom.id, endAfter: (new Date())}).subscribe(
        bookings => {
          this.actualBookings = bookings;
          if (this.selectedDate) {
            this.computeUnavailableHours();
            if (this.checkConflicts(this.startDate, this.endDate)) {
              console.log('BookingDialogComponent::onSelectedDateChanged() unset startTime/endTime because the new date dont match the availabilities')
              this.unsetTimePickers();
            }
            this.updateCalendar();
            // this.updatePrice();
          }
        }
      );
    }

  }

  dateInPastValidator(form: FormGroup) {
    const startDate: Date = new Date(form.controls['startDate'].value);
    // startDate.setHours(Math.floor(this.startTime));
    // startDate.setMinutes(60 * (this.startTime - Math.floor(this.startTime)) );
    if (startDate.getTime() < Date.now()) {
      return { dateInPast: true };
    }
    return null;
  }


  checkConflicts(startDate: Date, endDate: Date): boolean {
    let actualDateBookings = this.getActualDateBookings(startDate);
    for (let booking of actualDateBookings) {
      // exclude current booking from conflict check
      if ((this.data.id === booking.id)
       || (booking.recurrencePatternId && (booking.recurrencePatternId === this.data.recurrencePatternId))) {
        continue;
      }
      if ((booking.startDate < endDate) && (booking.endDate > startDate)) {
        console.log('BookingDialogComponent::checkConflicts() conflict found with event ', booking);
        return true;
      }
    }
    return false;
  }


  get startDate(): Date {
    if (!this.startTime) {
      return undefined;
    }
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.startTime));
    date.setMinutes(60 * (this.startTime - Math.floor(this.startTime)) );
    return date;
  }

  get endDate(): Date {
    if (!this.endTime) {
      return undefined;
    }
    let date: Date = new Date(this.form.value.date);
    date.setHours(Math.floor(this.endTime));
    date.setMinutes(60 * (this.endTime - Math.floor(this.endTime)) );
    return date;
  }
  get startTime() {
    return this._startTime;
  }
  set startTime(value: number) {
    if (this._startTime !== value) {
      console.log('BookingDialogComponent::set startTime()', value);
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
  get endTime() {
    return this._endTime;
  }
  set endTime(value: number) {
    if (this._endTime !== value) {
      let oldEndTime = this._endTime;
      this._endTime = value;
      this.updateCalendar();
      if (this.endTimePicker) {
        this.endTimePicker.setHourWithoutNotification(this._endTime);
      }
    }
  }

  OnCalendarPreviewUpdated(event: {startDate: Date, endDate: Date}) {
    console.log('BookingDialogComponent::OnCalendarPreviewUpdated, event', event);
    let date: number = new Date(event.startDate).setHours(0, 0, 0, 0);
    if ((event.startDate.getTime() >= Date.now()) && !this.checkConflicts(event.startDate, event.endDate)) {
      let {valid, startTime, endTime} = this.validateHours(BookingDialogComponent.getTimeFromDate(event.startDate), BookingDialogComponent.getTimeFromDate(event.endDate));
      if (this.form && valid) {
        this.shallUpdateCalendar = false;
        this.form.patchValue({date: new Date(date)});
        this.onSelectedDateChanged();
        this.startTime = startTime;
        this.endTime = endTime;
        this.form.patchValue({startDate: this.startDate});
        this.form.patchValue({endDate: this.endDate});
        // this.updatePrice();
        this.shallUpdateCalendar = true;
      }
    }
    this.updateCalendar();
  }

  updateCalendar() {
    if (this.calendar && this.shallUpdateCalendar && this.startDate && this.endDate) {
      this.calendar.previewEvent(this.form.value.title, this.startDate, this.endDate);
    }
  }

  set selectedExtras(value: any[]) {
    console.log('BookingDialogCOmponent::selectedExtras() ', value);
    this._selectedExtras = value;
    // this.updatePrice();
  }
  get selectedExtras() {
    return this._selectedExtras;
  }

  get priceData(): {
    hourQuantity: number,
    roomRatePerHour: number,
    extras: Extra[]
  } {
    let hourQuantity = 0;
    let roomRatePerHour = 0;
    let extras = [];
    roomRatePerHour = this.selectedRoom.getRentRateHour(
      (this.isCharity) ? eOrganizationType.CHARITY : 'default'
    );
    if (this.endDate && this.startDate) {
      let durationMS = this.endDate.valueOf() - this.startDate.valueOf();
      let durationHour = durationMS / (1000 * 60 * 60);
      hourQuantity = durationHour;
    }
    for (let extraId of this._selectedExtras) {
      let extra = this.getExtraFromId(extraId);
      extras.push(extra);
    }
    return {
      hourQuantity,
      roomRatePerHour,
      extras
    };
  }


  get nbOccurrences(): number {
    return this.nextOccurrences.length;
  }

  editRecurrence() {
    RecurrencePatternDialogComponent.editPattern(
      this.dialog,
      this.recurrencePattern,
      this.startDate ? this.startDate : this.form.controls.date.value,
      ({startDate, ...pattern}) => {
        this.recurrencePattern = pattern;
        if (pattern) {
          this.form.controls.recurrencePatternId.patchValue(pattern.id);
          this.form.controls.date.patchValue(startDate);
          this.onSelectedDateChanged();
          const monthlyMode = pattern.dayInMonth > 0 ? 'day' : 'week';
          this.nextOccurrences = this.recurrencePatternService.computeOccurrences(pattern, this.startDate, monthlyMode);
          this.nextOccurrences = this.removeConflicts(this.nextOccurrences);

        } else {
          this.form.controls.recurrencePatternId.patchValue(null);
          this.nextOccurrences = [];
        }
      }
    );
  }

  recurrencePattern2String(): string {
    if (!this.recurrencePattern) {
      return '';
    }
    const monthlyMode = this.recurrencePattern.dayInMonth > 0 ? 'day' : 'week';
    return recurrencePattern2String(
      this.recurrencePattern,
      new Date(this.form.controls.date.value),
      monthlyMode);
  }

  removeConflicts(occurrences: Date[]): Date[] {
    let conflictsStr = '';
    const occurrencesNoConflict = [];
    for (const occurrence of occurrences) {
      const duration = this.endDate.valueOf() - this.startDate.valueOf();
      const conflict = this.checkConflicts(occurrence, new Date(occurrence.valueOf() + duration) );
      if (conflict) {
        conflictsStr += occurrence.toLocaleDateString() + '\n';
      } else {
        occurrencesNoConflict.push(occurrence);
      }
    }
    if (conflictsStr !== '') {
      alert('The room can not be booked at the following dates:\n' + conflictsStr);
    }
    return occurrencesNoConflict;
  }

  getExtraFromId(extraId): Extra {
    return this.extraService.getExtraFromId(extraId);
  }

  unsetTimePickers() {
      try {
        this.startTimePicker.setHourWithoutNotification(undefined);
        this._startTime = undefined;
        this.form.patchValue({startDate: undefined});
        this.endTimePicker.setHourWithoutNotification(undefined);
        this._endTime = undefined;
        this.form.patchValue({endDate: undefined});
        // this.updatePrice();
    } catch (e) {
      console.error(e);
    }
  }

  onSelectedDateChanged() {
    this.computeUnavailableHours();
    // If the current selected time slot in not available anymore with the new date, unset it
    if (this.checkConflicts(this.startDate, this.endDate)) {
        console.log('BookingDialogComponent::onSelectedDateChanged() unset startTime/endTime because the new date dont match the availabilities');
        this.unsetTimePickers();
    }
    this.form.patchValue({startDate: this.startDate});
    this.form.patchValue({endDate: this.endDate});
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
      // exclude current booking
      if (this.data.id === booking.id) {
        continue;
      }
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

  startTimeChanged(event: any) { // this event is raised when the user select another time in time-picker
    console.log('BookingDialogComponent::startTimeChanged()', event);
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
    // this.updatePrice();
  }
  endTimeChanged(event: any) { // this event is raised when the user select another time in time-picker
    console.log('BookingDialogComponent::endTimeChanged()', event);
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
    // this.updatePrice();
  }

  validateHours(startTime: number, endTime: number): {valid: boolean, startTime: number, endTime: number} {
    if (startTime < this.minTime) {
      startTime = this.minTime;
    }
    if (endTime <= startTime) {
      endTime = startTime + this.increment;
    }
    if (endTime > this.maxTime) {
      endTime = this.maxTime;
    }
    return {valid: true, startTime: startTime, endTime: endTime};
  }

  startTimeChangeRequest(event: any) {
    console.log('BookingDialogComponent::startTimeChangeRequest() event=', event);
  }

  datePickerFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  onchangeRecurrent(isRecurrent: boolean) {
  }

  compareRooms(room1: Room, room2: Room): boolean {
    if (room1 && room2) {
      return room1.id === room2.id
     } else {
      return room1 === room2
     }
  }

  bookingFilter = (booking) => {
    return (this.data.id === undefined) || (this.data.id !== booking.id);
  }

  submit() {
    this.form.patchValue({startDate: this.startDate});
    this.form.patchValue({endDate: this.endDate});
    this.form.patchValue({totalPrice: this.priceDisplay.totalPrice});
  }


}
