import { Component, OnInit } from '@angular/core';
import { BookingService } from '../_services/booking.service';
import { Booking } from '../model/booking';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Room } from '../model';
import { RoomService } from '../_services/room.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {

  booking: Booking;
  room: Room;

  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private location: Location, // required to get back in navigation history
    private bookingService: BookingService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    const ref = this.route.snapshot.paramMap.get('ref');
    this.getBooking(ref);
  }

  getBooking(ref: string) {
    this.bookingService.getBooking(ref).subscribe(
      booking => {
        this.booking = booking;
        this.getRoom(this.booking.roomId);
      }
    );
  }

  getRoom(roomId) {
    this.roomService.getRoomFromId(roomId).subscribe(
      room => this.room = room
    );
  }

  goBack() {
    this.location.back();
  }
}
