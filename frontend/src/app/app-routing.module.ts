import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsComponent } from './rooms/rooms.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { InitDBComponent } from './init-db/init-db.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingOverviewComponent, canActivate: [AuthGuard] },
  { path: 'bookings/booking/:ref', component: BookingDetailComponent, canActivate: [AuthGuard] },
  { path: 'bookings/create', component: BookingDetailComponent, canActivate: [AuthGuard] },
  { path: 'rooms/room/:name', component: RoomDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'init', component: InitDBComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
