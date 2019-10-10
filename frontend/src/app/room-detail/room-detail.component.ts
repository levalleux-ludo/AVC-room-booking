import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../_services/room.service';
import { Location } from '@angular/common';
import { Room } from '../model';
import { Booking, duration } from '../model/booking';
import { BookingService } from '../_services/booking.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  room: Room;

  images: string[];

  pastBookings: Booking[];
  nextBookings: Booking[];

  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private router: Router, // required to force navigation to another route
    private roomService: RoomService,
    private bookingService: BookingService,
    private location: Location // required to get back in navigation history
  ) { }

  ngOnInit() {
    this.getRoom();
  }

  getRoom(): void {
    const name = this.route.snapshot.paramMap.get('name');
    console.log("RoomDetailComponent get room name from URL :", name);
    this.roomService.getRoom(name).subscribe(
      room => {
        this.room = room;
        this.getBookings(this.room.id);
        this.images = [this.roomService.getRoomImage(room.name)];
      });
  }

  getBookings(roomId): void {
    let now = new Date();
    let yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()-1);
    this.bookingService.getBookings({
      roomId: roomId,
      endBefore: now
    }).subscribe(
      bookings => this.pastBookings = bookings
    );
    this.bookingService.getBookings({
      roomId: roomId,
      endAfter: now
    }).subscribe(
      bookings => this.nextBookings = bookings
    );

  }

  goBack() {
    this.location.back();
  }

  bookNow() {
    this.router.navigate(['/bookings/create'], { queryParams: { roomId: `${this.room.id}` } });
  }

  duration (booking: Booking) {
    duration(booking);
  }

}
