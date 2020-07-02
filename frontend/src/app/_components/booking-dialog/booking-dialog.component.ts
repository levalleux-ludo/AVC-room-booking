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
import { BookingDialogStepTwoComponent } from '../booking-dialog-step-two/booking-dialog-step-two.component';
import { BookingDialogStepThreeComponent } from '../booking-dialog-step-three/booking-dialog-step-three.component';
import { PdfCreatorService } from 'src/app/_services/pdf-creator.service';
import { CryptoService } from 'src/app/_services/crypto.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { OrganizationService } from 'src/app/_services/organization.service';


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

  @ViewChild('formStepTwo', {static: false})
  formStepTwo: BookingDialogStepTwoComponent;

  @ViewChild('formStepThree', {static: false})
  formStepThree: BookingDialogStepThreeComponent;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookingDialogComponent>,
    private bookingService: BookingService,
    private recurrencePatternService: RecurrentEventService,
    private extraService: ExtraService,
    private changeDetector: ChangeDetectorRef,
    private bookingsConfigService: BookingsConfigService,
    private pdfCreatorService: PdfCreatorService,
    private filesServices: FilesService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  form: FormGroup;
  globalForm: FormGroup;

  readOnly = true;
  newBooking = false;
  canModify = false;


  newOrganization = NEW_ORGANIZATION;

  static editBooking(
    dialog: MatDialog,
    bookingService: BookingService,
    recurrentEventService: RecurrentEventService,
    pdfCreatorService: PdfCreatorService,
    cryptoService: CryptoService,
    filesService: FilesService,
    notificationService: NotificationService,
    organizationService: OrganizationService,
    authenticationService: AuthenticationService,
    userService: UserService,
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
    // dialogConfig.panelClass = 'form-booking';
    dialogConfig.data = {
      id: booking.id,
      title: privateData.title,
      organization,
      description: privateData.details,
      nbPeopleExpected: booking.nbPeopleExpected,
      // room: this.room.name,
      room,
      extras: privateData.extras,
      totalPrice: privateData.totalPrice,
      date: new Date(booking.startDate.getUTCFullYear(), booking.startDate.getUTCMonth(), booking.startDate.getUTCDate()),
      startDate: booking.startDate,
      endDate: booking.endDate,
      organizations,
      rooms,
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
        const report = {encryptionKey: '', formId: '', bookingId: '', nextOccurrencesId: []};
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
              organizationService.createOrganization(newOrganization).subscribe((orga) => {
                const user = authenticationService.currentUserValue;
                if (user) {
                  if (!user.memberOf.includes(orga.id)) {
                    user.memberOf.push(orga.id);
                    userService.changeMemberOf(user).subscribe(() => {
                      resolve(orga.id);
                    });
                  }
                } else {
                  resolve(orga.id);
                }
              }, err => reject(err));
            } else {
              resolve(data.organization.id);
            }
          }).then((organizationId) => {
            privateData.organizationId = organizationId;

            // 1. create a PDF with booking details
            new Promise<any>((resolve, reject) => {
              const pdfData = pdfCreatorService.createBookingForm(booking, privateData, data.signatureURL);
              pdfData.open();
              // 2. Upload PDF onto S3
              pdfData.getStrBase64().then((pdfText) => {
                // filesService.uploadFile(new File([blob], booking.id + '.pdf')).subscribe(({fileId}) => {
                //   // 3. Reference PDF url in booking params (update db model: new field bookingForm)
                //   booking.bookingFormId = fileId;
                //   report.formId = fileId;
                //   resolve();
                // }, err => reject(err));
                //  TODO  encrypt the PDF to preserve privacy (public access on S3 storage)
                // keep the key in booking.privateData
                cryptoService.AES.generateKey().then((key: string) => {
                  privateData.encryptionKey = key;
                  report.encryptionKey = key;
                  // TODO Convert to arraybuffer error: https://www.google.com/search?client=opera&q=RangeError%3A+byte+length+of+Uint16Array+should+be+a+multiple+of+2&sourceid=opera&ie=UTF-8&oe=UTF-8

                  // new Response(blob).arrayBuffer().then(buffer => {
                  cryptoService.AES.encryptStr(pdfText, key).then((cypherPdfData: ArrayBuffer) => {
                    filesService.uploadFile(new File([cypherPdfData], booking.id + '.pdf')).subscribe(({fileId}) => {
                      // 3. Reference PDF url in booking params (update db model: new field bookingForm)
                      booking.bookingFormId = fileId;
                      report.formId = fileId;
                      resolve();
                    }, err => alert(err));
                  }).catch(err => alert(err));
                  // }).catch(err => alert(err));
                }).catch(err => alert(err));
              }).catch(err => reject(err));
            }).then(() => {

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

                  // store updatedBooking.id in creation report
                  report.bookingId = updatedBooking.id;

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
                          resolve(bookings);
                        }, err => { reject(err); });
                      } else {
                        resolve([]);
                      }
                    }).then((bookings: Booking[]) => {

                      // store bookings.id in creation/update report
                      bookings.map(aBooking => report.nextOccurrencesId.push(aBooking.id));

                      // call service for creation/update report creation (includes email notification)
                      if (result.action === 'create') {
                        notificationService.onCreateBooking(report).subscribe(() => {
                        }, err => {
                          alert(err);
                        });
                      } else {
                        notificationService.onUpdateBooking(report).subscribe(() => {
                        }, err => alert(err));
                      }

                      then(booking, privateData);
                    }).catch(err => alert(err));
                  }).catch(err => alert(err));
                }, err => { alert(err); });
              }).catch(err => { alert(err); });
            }).catch(err => { alert(err); });
          }).catch(err => alert(err));

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
              report.bookingId = booking.id;
              notificationService.onDeleteBooking(report).subscribe(() => {
              }, err => alert(err));
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
    this.globalForm = this.fb.group({
      first: [this.fb.group({}), Validators.required],
      second: [this.fb.group({}), Validators.required],
      third: [this.fb.group({}), Validators.required]
    });
    // this.onSelectedDateChanged();
    if (!this.data.id) {
      this.newBooking = true;
      this.readOnly = false;
    }
    if (!this.newBooking) {
      // if booking already exists ('update'), check its state to know if the dialog must be readonly or not
      this.bookingService.getBookingState(this.data.id).subscribe((state) => {
        this.canModify = (state === 'Scheduled');
      });
    }
  }

  ngAfterViewInit(): void {

    this.globalForm = this.fb.group({
      first: this.formStepOne.form,
      second: this.formStepTwo.form,
      third: this.formStepThree.form
    });
    // this.globalForm.controls.first.setValue(this.formStepOne.form);
    // this.globalForm.controls.second.setValue(this.formStepTwo.form);
    // this.globalForm.controls.third.setValue(this.formStepThree.form);
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked(): void {
  }

  isValid() {
    return this.globalForm && this.globalForm.valid;
  }

  // updatePrice() {
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

  // }





  // dateIsPast = (controlName: string) => {
  //   const date = this.form.controls['date'].value.getTime();
  //   if (date < Date.now()) {
  //     return true;
  //   }
  //   return false;
  // }


  submit(form) {
      this.formStepTwo.submit();
      this.dialogRef.close({action: (this.newBooking) ? 'create' : 'update', data: {
        ...this.formStepOne.form.value,
        ...this.formStepTwo.form.value,
        ...this.formStepThree.form.value,
        recurrencePattern: this.formStepTwo.recurrencePattern,
        deleteAllOccurrences: false,
        nextOccurrences: this.formStepTwo.nextOccurrences
      }});
  }

  deleteEvent() {
    // check if the event is not already started or completed
    this.bookingService.getBookingState(this.data.id).subscribe((state) => {
      let confirmDialogRef;
      let deletedAllowed = false;
      if (state === 'InProgress') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.formStepTwo.form.value.title}' cannot be deleted because it is already started`}
        });
      } else if (state === 'Completed') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.formStepTwo.form.value.title}' cannot be deleted because it is already completed`}
        });
      } else if (state === 'Cancelled') {
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Error', message: `booking event '${this.formStepTwo.form.value.title}' cannot be deleted because it is already cancelled`}
        });
      } else {
        deletedAllowed = true;
        confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {title: 'Delete Confirmation', message: `Are you sure you want to delete the booking event '${this.formStepTwo.form.value.title}' ?`}
        });
      }
      confirmDialogRef.afterClosed().subscribe(result => {
        if (result && deletedAllowed) {
          this.dialogRef.close({action: 'delete', data: this.data.id});
        }
      });
    });
  }


  // onchangeRecurrent(isRecurrent: boolean) {
    // if (this.readOnly) {
    //   this.form.controls.isRecurrent.patchValue(!isRecurrent);
    // }
  // }

  generateBookingForm() {
    this.pdfCreatorService.createBookingForm(this.data.booking, this.data.booking.privateDataRef, '').open();
  }

}
