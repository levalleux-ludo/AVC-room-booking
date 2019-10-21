import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
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
  MatTabsModule
  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { InitDBComponent } from './init-db/init-db.component';
import { TestCalendarComponent } from './test-calendar/test-calendar.component';
import { 
  NgbModalModule,
  NgbCarouselModule,
  NgbTimepickerModule,
  NgbToastModule
 } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TestFullCalendarComponent } from './test-full-calendar/test-full-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
// import { jqxBarGaugeModule }    from 'jqwidgets-ng/jqxbargauge';
import { jqxSchedulerModule }    from 'jqwidgets-ng/jqxscheduler';
import { TestJqxSchedulerComponent } from './test-jqx-scheduler/test-jqx-scheduler.component';
import { jqxCalendarModule } from 'jqwidgets-ng/jqxcalendar';
import { ChartistModule } from 'ng-chartist';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { FooterComponent } from './footer/footer.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { RoomCardComponent } from './room-card/room-card.component';
import { RoomCalendarComponent } from './room-calendar/room-calendar.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { PriceDisplayComponent } from './price-display/price-display.component';
import { ConfigureComponent } from './configure/configure.component';
import { ConfigureOrganizationsComponent } from './configure-organizations/configure-organizations.component';
import { ConfigureRoomsComponent } from './configure-rooms/configure-rooms.component';
import { ConfigureExtrasComponent } from './configure-extras/configure-extras.component';
import { ConfigureGenericComponent } from './configure-generic/configure-generic.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

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
    ConfirmDialogComponent
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
    NgbToastModule
  ],
  exports: [
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BookingDialogComponent, // required to use the component as a dialog body
    ConfirmDialogComponent
  ]
})
export class AppModule { }
