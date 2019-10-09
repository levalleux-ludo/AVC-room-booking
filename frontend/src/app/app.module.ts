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
import { MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule  } from '@angular/material';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { InitDBComponent } from './init-db/init-db.component';
import { TestCalendarComponent } from './test-calendar/test-calendar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TestFullCalendarComponent } from './test-full-calendar/test-full-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
// import { jqxBarGaugeModule }    from 'jqwidgets-ng/jqxbargauge';
import { jqxSchedulerModule }    from 'jqwidgets-ng/jqxscheduler';
import { TestJqxSchedulerComponent } from './test-jqx-scheduler/test-jqx-scheduler.component';
import { jqxCalendarModule } from 'jqwidgets-ng/jqxcalendar';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { FooterComponent } from './footer/footer.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { RoomCardComponent } from './room-card/room-card.component';

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
    RoomCardComponent
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
    NgxScrollTopModule
  ],
  exports: [
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
