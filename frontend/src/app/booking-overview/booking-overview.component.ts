import { Component, OnInit } from '@angular/core';
import { BookingService } from '../_services/booking.service';
import { Booking, duration } from '../model/booking';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.scss']
})
export class BookingOverviewComponent implements OnInit {

  bookings: Booking[];

  constructor(
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getBookings().subscribe(
      bookings => this.bookings = bookings
    );
  }

  duration (booking: Booking) {
    duration(booking);
  }


}
