import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../_services/room.service';
import { Location } from '@angular/common';
import { Room } from '../model';
import { Booking, duration } from '../model/booking';
import { BookingService } from '../_services/booking.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;

  room: Room;

  roomDescription = `<font face="Times New Roman" size="7">Hello my friend.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`;

  images: string[];

  pastBookings: Booking[];
  nextBookings: Booking[];
  rooms: Room[];

  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private router: Router, // required to force navigation to another route
    private roomService: RoomService,
    private bookingService: BookingService,
    private location: Location, // required to get back in navigation history
    private dialog: MatDialog // required to open a dialog
  ) { }

  ngOnInit() {
    this.getRoom();
    this.getAllRooms();
  }

  getAllRooms() {
this.roomService.getRooms().subscribe(
  rooms => {
    this.rooms = rooms.map(room => new Room(room));
  }
)  }

  getRoom(): void {
    const name = this.route.snapshot.paramMap.get('name');
    console.log("RoomDetailComponent get room name from URL :", name);
    this.roomService.getRoom(name).subscribe(
      room => {
        this.room = new Room(room);
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
    // this.router.navigate(['/bookings/create'], { queryParams: { roomId: `${this.room.id}` } });
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      // room: this.room.name,
      room: this.room,
      organizations: [
        "Company#1",
        "Company#2",
        "Company#3"
      ],
      rooms: this.rooms,
      // rooms: this.rooms.map(room => room.name),
    }

    const dialogRef = this.dialog.open(BookingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        let booking = this.bookingService.getEmptyBooking();
        booking.title = data.title;
        booking.details = '';
        booking.organization = data.organization;
        booking.roomId = data.room.id;
        booking.startDate = data.startDate;
        booking.endDate = data.endDate;
        this.bookingService.createBooking(booking).subscribe(
          (newBooking) => {
            console.log("booking has been created:", newBooking);
            if (booking.roomId === this.room.id) {
              this.getBookings(this.room.id);
              this.calendar.getBookings();
            } else {
              this.roomService.getRoomFromId(booking.roomId).subscribe(
                room => {
                  this.router.navigate(['../', encodeURI(room.name)], {relativeTo: this.route, skipLocationChange: false}).then(
                    result => {
                      console.log("routing result=", result);
                      window.location.reload();
                  },
                  error => {
                    console.error("routing failed", error);
                  })
                }
              )
            }
            
          }
        )
      }
    );

    
  }

  duration (booking: Booking) {
    duration(booking);
  }

}
