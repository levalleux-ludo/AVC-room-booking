import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig, ErrorStateMatcher} from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Room } from '../../_model';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { BookingService } from '../../_services/booking.service';
import { Booking, BookingPrivateData, RecurrencePatternParams, RecurrencePattern } from '../../_model/booking';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { PriceDisplayComponent } from '../price-display/price-display.component';
import { ExtraService } from '../../_services/extra.service';
import { Extra } from '../../_model/extra';
import { Observable, Subscription } from 'rxjs';
import { Organization, eOrganizationType } from '../../_model/organization';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BookingsConfigService } from 'src/app/_services/bookings-config.service';
import { FilesService } from 'src/app/_services/files.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services';
import { RecurrencePatternDialogComponent, recurrencePattern2String } from '../recurrence-pattern-dialog/recurrence-pattern-dialog.component';
import { RecurrentEventService } from 'src/app/_services/recurrent-event.service';
import { BookingDialogStepOneComponent } from '../booking-dialog-step-one/booking-dialog-step-one.component';


const NEW_ORGANIZATION = {name: 'New Organization ...'};
export class DateInPastErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // return control.dirty && form.invalid;
    return form.invalid;
  }
}

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('formStepOne', {static: false})
  formStepOne: BookingDialogStepOneComponent;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookingDialogComponent>,
    private bookingService: BookingService,
    private recurrencePatternService: RecurrentEventService,
    private extraService: ExtraService,
    private changeDetector: ChangeDetectorRef,
    private bookingsConfigService: BookingsConfigService,
    private filesServices: FilesService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  set selectedExtras(value: any[]) {
    console.log('BookingDialogCOmponent::selectedExtras() ', value);
    this._selectedExtras = value;
    this.updatePrice();
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
      (this.formStepOne && this.formStepOne.isCharity) ?
        eOrganizationType.CHARITY : 'default'
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

  get selectedRoom(): Room {
    return this._selectedRoom;
  }
  set selectedRoom(value: Room) {
    this._selectedRoom = value;
    if (this._selectedRoom) {
      this.bookingService.getBookings({roomId: this._selectedRoom.id, endAfter: (new Date())}).subscribe(
        bookings => {
          this.actualBookings = bookings;
          if (this.selectedDate) {
            this.computeUnavailableHours();
            if (this.checkConflicts(this.startDate, this.endDate)) {
              console.log('BookingDialogComponent::onSelectedDateChanged() unset startTime/endTime because the new date dont match the availabilities')
              this.unsetTimePickers();
            }
            this.updateCalendar();
            this.updatePrice();
          }
        }
      )
    }

  }

  get selectedDate(): Date {
    return this.form.value.date;
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

  get nbOccurrences(): number {
    return this.nextOccurrences.length;
  }
  form: FormGroup;
  thirdFormGroup: FormGroup;
  globalForm: FormGroup;


  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;
  @ViewChild('startTimePicker', {static: false}) startTimePicker: TimePickerComponent;
  @ViewChild('endTimePicker', {static: false}) endTimePicker: TimePickerComponent;
  @ViewChild('price', {static: false}) priceDisplay: PriceDisplayComponent;
  @ViewChild('dateInput', {static: false}) dateInput: ElementRef;

  _selectedRoom: Room;
  availableExtras = [];
  actualBookings: Booking[] = [];
  unavailableStartHours: number[] = [];
  unavailableEndHours: number[] = [];
  increment = 0.5;
  minTime = 8;
  maxTime = 20;
  today = new Date();
  readOnly = true;
  newBooking = false;
  canModify = false;
  tacLink = 'https://ashfordvc.org.uk/';

  _selectedExtras: any[] = [];

  errorMatcher = new DateInPastErrorMatcher();
  tacChecked = false;
  newOrganization = NEW_ORGANIZATION;

  recurrencePattern: RecurrencePatternParams = undefined;
  nextOccurrences: Date[] = [];

  shallUpdateCalendar = true;

  _startTime: number = 0;

  _endTime: number = 0;

  static editBooking(
    dialog: MatDialog,
    bookingService: BookingService,
    recurrentEventService: RecurrentEventService,
    createOrgaSrv: (orga: Organization) => Observable<Organization>,
    then: (Booking, privateData: BookingPrivateData) => void,
    organizations: Organization[],
    rooms: Room[],
    booking: Booking,
    room?: Room): Subscription {

    if (!room && booking.roomId) {
      room = rooms.find(room => room.id === booking.roomId);
    }
    let privateData: BookingPrivateData = booking.privateDataRef;

    let organization;
    if (privateData) {
      organization = organizations.find(org => org.id === privateData.organizationId);
    } else {
      privateData = new BookingPrivateData();
    }
    if ((organization === undefined) && (organizations.length === 1)) {
      organization = organizations[0];
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-booking';
    dialogConfig.data = {
      id: booking.id,
      title: privateData.title,
      organization: organization,
      description: privateData.details,
      nbPeopleExpected: booking.nbPeopleExpected,
      // room: this.room.name,
      room: room,
      extras: privateData.extras,
      totalPrice: privateData.totalPrice,
      date: new Date(booking.startDate.getUTCFullYear(), booking.startDate.getUTCMonth(), booking.startDate.getUTCDate()),
      startDate: booking.startDate,
      endDate: booking.endDate,
      organizations: organizations,
      rooms: rooms,
      hirersDetails: privateData.hirersDetails,
      responsibleDetails: privateData.responsibleDetails,
      isRecurrent: booking.recurrencePatternId !== null,
      recurrencePatternId: booking.recurrencePatternId
      // rooms: this.rooms.map(room => room.name),
    };

    const dialogRef = dialog.open(BookingDialogComponent, dialogConfig);
    return dialogRef.afterClosed().subscribe(
      result => {
        const data = result.data;
        if ((result.action === 'create') || (result.action === 'update')) {

          booking.roomId = data.room.id;
          booking.startDate = data.startDate;
          booking.endDate = data.endDate;
          privateData.title = data.title;
          privateData.details = data.description;
          privateData.extras = data.extras;
          privateData.totalPrice = data.totalPrice;
          privateData.hirersDetails = data.hirersDetails;
          privateData.responsibleDetails = data.responsibleDetails;

          // Create new organization if needed
          new Promise<any>((resolve, reject) => {
            if (NEW_ORGANIZATION.name === data.organization.name) {
              console.log('Must create a new organization in database');
              const newOrganization = new Organization({
                ...data.organizationDetails
              });
              createOrgaSrv(newOrganization).subscribe((orga) => {
                resolve(orga.id);
              });
            } else {
              resolve(data.organization.id);
            }
          }).then((organizationId) => {
            privateData.organizationId = organizationId;

            // Create Recurrence pattern if needed
            new Promise<RecurrencePattern>((resolve, reject) => {
              if (data.isRecurrent) {
                new Promise<boolean>((resolve2, reject2) => {
                  if (booking.recurrencePatternId === null) {
                    resolve2(true);
                  } else {
                    bookingService.getRecurrencePattern(booking.recurrencePatternId).subscribe(pattern => {
                      pattern.endDate = new Date(pattern.endDate);
                      let isDifferent = (pattern.frequency !== data.recurrencePattern.frequency);
                      isDifferent = isDifferent || (pattern.recurrence !== data.recurrencePattern.recurrence);
                      isDifferent = isDifferent || (pattern.endDate.valueOf() !== data.recurrencePattern.endDate.valueOf());
                      isDifferent = isDifferent
                      || ((pattern.frequency === 'Weekly') && (pattern.weekMask !== data.recurrencePattern.weekMask));
                      isDifferent = isDifferent
                      || ((pattern.frequency === 'Monthly') && (pattern.dayInMonth !== data.recurrencePattern.dayInMonth));
                      isDifferent = isDifferent
                      || ((pattern.frequency === 'Monthly') && (pattern.weekDayInMonth !== data.recurrencePattern.weekDayInMonth));
                      isDifferent = isDifferent
                      || ((pattern.frequency === 'Monthly') && (pattern.weekInMonth !== data.recurrencePattern.weekInMonth));
                      resolve2(isDifferent);
                    }, err => reject2(err));
                  }
                }).then(shallCreateNewRecurrence => {
                  if (shallCreateNewRecurrence) {
                    console.log('create new occurrence pattern');
                    recurrentEventService.create(booking, privateData, data.recurrencePattern).then(recurrencePattern => {
                      resolve(recurrencePattern);
                    }).catch(err => reject(err));
                  } else {
                    resolve(booking.recurrencePatternId);
                  }
                }).catch(err => reject(err));
              } else {
                resolve(null); // do not use undefined cause we need te reset the field in database
              }
            }).then((recurrencePatternId) => {
              const oldRecurrencePatternId = booking.recurrencePatternId;
              booking.recurrencePatternId = recurrencePatternId;

              // Create or update the main event
              let createOrUpdateSrv: Observable<Booking>;
              if (result.action === 'create') {
                console.log('create main event');
                createOrUpdateSrv =  bookingService.createBooking(booking, privateData);
              } else {
                console.log('update main event');
                createOrUpdateSrv = bookingService.updateBooking(booking, privateData);
              }
              createOrUpdateSrv.subscribe((updatedBooking) => {

                // If recurrence is removed or updated, delete next occurrences
                new Promise((resolve, reject) => {
                  if (oldRecurrencePatternId !== null) {
                    console.log('remove pattern and next occurrences');
                    bookingService.deletePatternAndBookings(oldRecurrencePatternId, booking.endDate).subscribe(() => {
                      resolve();
                    }, err => reject(err));
                  } else {
                    resolve();
                  }
                }).then(() => {

                  // If recurrent, create next occurrences
                  new Promise((resolve, reject) => {
                    if (data.isRecurrent) {
                      const newBookingsParams = [];
                      const privateDatas = [];
                      const duration = booking.endDate.valueOf() - booking.startDate.valueOf();
                      for (let i = 1; i < data.nextOccurrences.length; i++) {
                        // Do not consider the first occurrence because it has already been created/updated above
                        const newBookingParams = {...booking};
                        newBookingParams.ref = bookingService.getNewRef();
                        newBookingParams.id = undefined;
                        newBookingParams.recurrencePatternId = recurrencePatternId;
                        newBookingParams.startDate = data.nextOccurrences[i];
                        newBookingParams.endDate = new Date(data.nextOccurrences[i].valueOf() + duration);
                        newBookingsParams.push(newBookingParams);
                        const newPrivateData = {...privateData};
                        newPrivateData['id'] = undefined;
                        newPrivateData['_id'] = undefined;
                        privateDatas.push(newPrivateData);
                      }
                      console.log('create next occurrences');
                      bookingService.createBookings(newBookingsParams, privateDatas).subscribe(({ bookings, errors }) => {
                        if (errors.length) {
                          alert(errors);
                        }
                        resolve();
                      }, err => { reject(err); });
                    } else {
                      resolve();
                    }
                  }).then(() => {
                    then(booking, privateData);
                  }).catch(err => alert(err));
                }).catch(err => alert(err));
              }, err => { alert(err); });
            }).catch(err => { alert(err); });
          }).catch(err => { alert(err); });
        } else if (result.action === 'delete') {

          bookingService.deleteBooking(booking.id).subscribe(() => {
            new Promise((resolve, reject) => {
              if (booking.recurrencePatternId && data.deleteAllOccurrences) {
                console.log('remove pattern and next occurrences');
                bookingService.deletePatternAndBookings(booking.recurrencePatternId, booking.endDate).subscribe(() => {
                  resolve();
                }, err => reject(err));
              } else {
                resolve();
              }
            }).then(() => {
              then(undefined, undefined);
            }).catch(err => alert(err));
          }, err => alert(err));
        }
      }
    );
  }

  static getTimeFromDate(date: Date): number {
    return date.getHours() + (date.getMinutes() / 60);
  }
  ngOnInit() {
    this.selectedRoom = this.data.room;
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

        this.thirdFormGroup = this.fb.group({
      tacChecked: false
    }, { validators: [this.tacIsChecked] });
    this.form = this.fb.group({
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
    this.globalForm = this.fb.group({
      first: undefined,
      second: this.form,
      third: this.thirdFormGroup
    });

    // this.onSelectedDateChanged();
    if (!this.data.id) {
      this.newBooking = true;
      this.readOnly = false;
    }
    if (!this.newBooking) {
      // if booking already exists ('update'), check its state to know if the dialog must be readonly or not
      this.bookingService.getBookingState(this.data.id).subscribe((state) => {
        this.canModify = (state === "Scheduled");
      });
    }
    this.bookingsConfigService.get().subscribe((bookingsConfig) => {
      if (this.newBooking) {
        this.minTime = bookingsConfig.startTime;
        this.maxTime = bookingsConfig.endTime;
      } else {
        this.minTime = Math.min(bookingsConfig.startTime, this.startTime);
        this.maxTime = Math.max(bookingsConfig.endTime, this.endTime);
      }
      if (bookingsConfig.termsAndConditions && (bookingsConfig.termsAndConditions.fileId !== '')) {
        this.filesServices.getFileUrl(bookingsConfig.termsAndConditions.fileId).subscribe((url) => {
          this.tacLink = url;
        })
      }
    });
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

  tacIsChecked(form: FormGroup) {
    if (!form.controls['tacChecked'].value) {
      return { tacNotChecked: true };
    }
    return null;
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

  ngAfterViewInit(): void {

    this.globalForm.controls.first.setValue(this.formStepOne.form);

    if (this.startTimePicker) {
      this.startTimePicker.setHourWithoutNotification(this._startTime);
    }
    if (this.endTimePicker) {
      this.endTimePicker.setHourWithoutNotification(this._endTime);
    }
    this.OnCalendarPreviewUpdated({startDate: this.data.startDate, endDate: this.data.endDate});
    this.extraService.refreshExtras();
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
  }

  updatePrice() {
    // if (this.priceDisplay) {
    //   this.priceDisplay.roomRatePerHour = this.selectedRoom.getRentRateHour(
    //     (this.firstFormGroup.controls['organizationDetails'] &&
    //       this.firstFormGroup.controls['organizationDetails'].value.isCharity) ?
    //         eOrganizationType.CHARITY : eOrganizationType.OTHER
    //       );

    //   let durationMS = this.endDate.valueOf() - this.startDate.valueOf();
    //   let durationHour = durationMS / (1000 * 60 * 60);
    //   this.priceDisplay.hourQuantity = durationHour;

    //   this.priceDisplay.extras = {};
    //   for (let extraId of this._selectedExtras) {
    //     let extra = this.getExtraFromId(extraId);
    //     this.priceDisplay.extras[extra.name] = extra.defaultRate;
    //   }
    // }

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
        this.updatePrice();
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

  // dateIsPast = (controlName: string) => {
  //   const date = this.form.controls['date'].value.getTime();
  //   if (date < Date.now()) {
  //     return true;
  //   }
  //   return false;
  // }

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
  updateCalendar() {
    if (this.calendar && this.shallUpdateCalendar && this.startDate && this.endDate) {
      this.calendar.previewEvent(this.form.value.title, this.startDate, this.endDate);
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
    this.updatePrice();
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
    this.updatePrice();
  }

  checkConflicts(startDate: Date, endDate: Date): boolean {
    let actualDateBookings = this.getActualDateBookings(startDate);
    for (let booking of actualDateBookings) {
      // exclude current booking from conflict check
      if ((this.data.id === booking.id) || (booking.recurrencePatternId === this.data.recurrencePatternId)) {
        continue;
      }
      if ((booking.startDate < endDate) && (booking.endDate > startDate)) {
        console.log('BookingDialogComponent::checkConflicts() conflict found with event ', booking);
        return true;
      }
    }
    return false;
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
        this.updatePrice();
        this.shallUpdateCalendar = true;
      }
    }
    this.updateCalendar();
  }

  startTimeChangeRequest(event: any) {
    console.log('BookingDialogComponent::startTimeChangeRequest() event=', event);
  }

  submit(form) {
      form.patchValue({second: {startDate: this.startDate}});
      form.patchValue({second: {endDate: this.endDate}});
      form.patchValue({second: {totalPrice: this.priceDisplay.totalPrice}});
      this.dialogRef.close({action: (this.newBooking) ? "create" : "update", data: {
        ...this.formStepOne.form.value,
        ...form.value.second,
        ...form.value.third,
        recurrencePattern: this.recurrencePattern,
        deleteAllOccurrences: false,
        nextOccurrences: this.nextOccurrences
      }});
  }

  compareRooms(room1: Room, room2: Room): boolean {
    if (room1 && room2) {
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

  deleteEvent() {
    // check if the event is not already started or completed
    this.bookingService.getBookingState(this.form.value.id).subscribe((state) => {
      let confirmDialogRef;
      let deletedAllowed = false;
      if (state === 'InProgress') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.form.value.title}' cannot be deleted because it is already started`}
        });
      } else if (state === 'Completed') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.form.value.title}' cannot be deleted because it is already completed`}
        });
      } else if (state === 'Cancelled') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.form.value.title}' cannot be deleted because it is already cancelled`}
        });
      } else {
        deletedAllowed = true;
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Delete Confirmation', message: `Are you sure you want to delete the booking event '${this.form.value.title}' ?`}
        });
      }
      confirmDialogRef.afterClosed().subscribe(result => {
        if (result && deletedAllowed) {
          this.dialogRef.close({action: "delete", data: this.form.value.id});
        }
      });
    });
  }

  bookingFilter = (booking) => {
    return (this.data.id === undefined) || (this.data.id !== booking.id);
  }

  onchangeRecurrent(isRecurrent: boolean) {
    // if (this.readOnly) {
    //   this.form.controls.isRecurrent.patchValue(!isRecurrent);
    // }
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
}
