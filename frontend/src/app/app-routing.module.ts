import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsComponent } from './_components/rooms/rooms.component';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { AuthGuard } from './_helpers';
import { RoomDetailComponent } from './_components/room-detail/room-detail.component';
import { BookingOverviewComponent } from './_components/booking-overview/booking-overview.component';
import { BookingDetailComponent } from './_components/booking-detail/booking-detail.component';
import { InitDBComponent } from './_components/init-db/init-db.component';
import { TestCalendarComponent } from './_components/test-calendar/test-calendar.component';
import { TestFullCalendarComponent } from './_components/test-full-calendar/test-full-calendar.component';
import { TestJqxSchedulerComponent } from './_components/test-jqx-scheduler/test-jqx-scheduler.component';
import { ConfigureComponent } from './_components/configure/configure.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'configure', component: ConfigureComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingOverviewComponent, canActivate: [AuthGuard] },
  { path: 'bookings/booking/:ref', component: BookingDetailComponent, canActivate: [AuthGuard] },
  { path: 'bookings/create', component: BookingDetailComponent, canActivate: [AuthGuard] },
  { path: 'rooms/room/:name', component: RoomDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'init', component: InitDBComponent },
  { path: 'calendar1', component: TestCalendarComponent },
  { path: 'calendar2', component: TestFullCalendarComponent },
  { path: 'calendar3', component: TestJqxSchedulerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
