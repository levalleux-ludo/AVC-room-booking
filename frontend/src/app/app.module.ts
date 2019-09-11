import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    RoomDetailComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    BookingOverviewComponent,
    BookingDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // required to use directives like FormGroup
    HttpClientModule, // required for injection in authentication.service
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
