import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignaturePadModule } from 'angular2-signaturepad';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsComponent } from './_components/rooms/rooms.component';
import { RoomDetailComponent, SetImageToCenterDirective } from './_components/room-detail/room-detail.component';
import { NavBarComponent } from './_components/nav-bar/nav-bar.component';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers';
import { BookingOverviewComponent } from './_components/booking-overview/booking-overview.component';
import { BookingDetailComponent } from './_components/booking-detail/booking-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatNativeDateModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatGridListModule,
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatTooltipModule,
  MatExpansionModule,
  MatListModule,
  MatTabsModule,
  MatIconModule,
  MatProgressBarModule,
  MatBottomSheetModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatCheckboxModule,
  MatStepperModule,
  MatSlideToggleModule,
  MatRadioModule
  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimePickerComponent } from './_components/time-picker/time-picker.component';
import { InitDBComponent } from './_components/init-db/init-db.component';
import { TestCalendarComponent } from './_components/test-calendar/test-calendar.component';
import {
  NgbModalModule,
  NgbCarouselModule,
  NgbTimepickerModule,
  NgbToastModule
 } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TestFullCalendarComponent } from './_components/test-full-calendar/test-full-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
// import { jqxBarGaugeModule }    from 'jqwidgets-ng/jqxbargauge';
import { jqxSchedulerModule }    from 'jqwidgets-ng/jqxscheduler';
import { TestJqxSchedulerComponent } from './_components/test-jqx-scheduler/test-jqx-scheduler.component';
import { jqxCalendarModule } from 'jqwidgets-ng/jqxcalendar';
import { ChartistModule } from 'ng-chartist';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BarChartComponent } from './_components/bar-chart/bar-chart.component';
import { FooterComponent } from './_components/footer/footer.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { RoomCardComponent } from './_components/room-card/room-card.component';
import { RoomCalendarComponent } from './_components/room-calendar/room-calendar.component';
import { BookingFormComponent } from './_components/booking-form/booking-form.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { BookingDialogComponent } from './_components/booking-dialog/booking-dialog.component';
import { PriceDisplayComponent } from './_components/price-display/price-display.component';
import { ConfigureComponent } from './_components/configure/configure.component';
import { ConfigureOrganizationsComponent } from './_components/configure-organizations/configure-organizations.component';
import { ConfigureRoomsComponent } from './_components/configure-rooms/configure-rooms.component';
import { ConfigureExtrasComponent } from './_components/configure-extras/configure-extras.component';
import { ConfigureGenericComponent, ItemPanelDirective } from './_components/configure-generic/configure-generic.component';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditDialogComponent } from './_components/edit-dialog/edit-dialog.component';
import { GlobalCalendarComponent } from './_components/global-calendar/global-calendar.component';
import { MaterialFileUploadComponent } from './_components/material-file-upload/material-file-upload.component';
import { DialogCarouselComponent } from './_components/dialog-carousel/dialog-carousel.component';
import { ConfigureUsersComponent } from './_components/configure-users/configure-users.component';
import { ConfigureWebsiteComponent } from './_components/configure-website/configure-website.component';
import { WaiterComponent } from './_components/waiter/waiter.component';
import { ErrorComponent } from './_components/error/error.component';
import { RegisterComponent } from './_components/register/register.component';
import { ConfigureBookingsComponent } from './_components/configure-bookings/configure-bookings.component';
import { OrganizationFormComponent } from './_components/organization-form/organization-form.component';
import { RecurrencePatternDialogComponent } from './_components/recurrence-pattern-dialog/recurrence-pattern-dialog.component';
import { AddressFormComponent } from './_components/address-form/address-form.component';
import { BookingDialogStepOneComponent } from './_components/booking-dialog-step-one/booking-dialog-step-one.component';
import { BookingDialogStepTwoComponent } from './_components/booking-dialog-step-two/booking-dialog-step-two.component';
import { BookingDialogStepThreeComponent } from './_components/booking-dialog-step-three/booking-dialog-step-three.component';
import { SignDialogComponent } from './_components/sign-dialog/sign-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    RoomDetailComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    BookingOverviewComponent,
    BookingDetailComponent,
    TimePickerComponent,
    InitDBComponent,
    TestCalendarComponent,
    TestFullCalendarComponent,
    TestJqxSchedulerComponent,
    BarChartComponent,
    FooterComponent,
    RoomCardComponent,
    RoomCalendarComponent,
    BookingFormComponent,
    BookingDialogComponent,
    PriceDisplayComponent,
    ConfigureComponent,
    ConfigureOrganizationsComponent,
    ConfigureRoomsComponent,
    ConfigureExtrasComponent,
    ConfigureGenericComponent,
    ConfirmDialogComponent,
    EditDialogComponent,
    ItemPanelDirective,
    GlobalCalendarComponent,
    MaterialFileUploadComponent,
    SetImageToCenterDirective,
    DialogCarouselComponent,
    ConfigureUsersComponent,
    ConfigureWebsiteComponent,
    WaiterComponent,
    ErrorComponent,
    RegisterComponent,
    ConfigureBookingsComponent,
    OrganizationFormComponent,
    RecurrencePatternDialogComponent,
    AddressFormComponent,
    BookingDialogStepOneComponent,
    BookingDialogStepTwoComponent,
    BookingDialogStepThreeComponent,
    SignDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule, // required to use directives like FormGroup
    HttpClientModule, // required for injection in authentication.service
    AppRoutingModule,
    BrowserAnimationsModule, // required for Material
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatDatepickerModule,  // required for mat-date-picker in forms
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FullCalendarModule,
    jqxSchedulerModule,
    jqxCalendarModule,
    NgbCarouselModule,
    ChartistModule,
    NgxScrollTopModule,
    MatGridListModule,
    MatCardModule,
    MatCarouselModule,
    FlexLayoutModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    NgbTimepickerModule,
    NgbToastModule,
    AngularEditorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    PdfViewerModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatRadioModule,
    SignaturePadModule
  ],
  exports: [
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatBottomSheetModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BookingDialogComponent, // required to use the component as a dialog body
    ConfirmDialogComponent,
    EditDialogComponent,
    DialogCarouselComponent,
    RecurrencePatternDialogComponent,
    SignDialogComponent
  ]
})
export class AppModule { }
