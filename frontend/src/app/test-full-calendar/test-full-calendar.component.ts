import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';

@Component({
  selector: 'app-test-full-calendar',
  templateUrl: './test-full-calendar.component.html',
  styleUrls: ['./test-full-calendar.component.scss']
})
export class TestFullCalendarComponent implements OnInit {
  // see https://fullcalendar.io/docs/angular

  calendarPlugins = [dayGridPlugin]; // important! for FullCalendar

  constructor(
    private bookingService: BookingService
  ) { }

  events;

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getBookings().subscribe(
      bookings => this.events = bookings.map(booking => this.booking2event(booking))
    );
  }

  booking2event(booking: Booking) {
    return {
      id: booking.ref,
      title: booking.title,
      start: booking.startDate, // convert to local time
      end: booking.endDate, // convert to local time
    }
  }
}
