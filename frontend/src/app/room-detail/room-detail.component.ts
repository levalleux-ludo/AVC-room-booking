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
import { ExtraService } from '../_services/extra.service';
import { Extra } from '../model/extra';
import { OrganizationService } from '../_services/organization.service';
import { Organization } from '../model/organization';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;

  room: Room;

  get roomDescription(): string {
    if (this.room)
      return atob(this.room.descriptionHTML);
    return `<div></div>`;
  }

  images: string[];

  pastBookings: Booking[];
  nextBookings: Booking[];
  rooms: Room[];
  organizations: Organization[];

  getExtraFromId(extraId): Extra {
    return this.extraService.getExtraFromId(extraId);
  }
  getRoomExtras() {
    if (this.room) {
      return this.room.availableExtras.map(extraId => this.getExtraFromId(extraId));
    }
    return [];
  }

  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private router: Router, // required to force navigation to another route
    private roomService: RoomService,
    private bookingService: BookingService,
    private extraService: ExtraService,
    private organizationService: OrganizationService,
    private location: Location, // required to get back in navigation history
    private dialog: MatDialog // required to open a dialog
  ) { }

  ngOnInit() {
    this.getRoom();
    this.getAllRooms();
    this.extraService.refreshExtras();
    this.organizationService.getOrganizations().subscribe(
      organizations => this.organizations = organizations.map(organization => new Organization(organization))
    );
  }

  getAllRooms() {
  this.roomService.getRooms().subscribe(
    rooms => {
      this.rooms = rooms.map(room => new Room(room));
    }
  ) 
 }

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
    BookingDialogComponent.editBooking(
      this.dialog,
      (newBooking) => this.bookingService.createBooking(newBooking),
      (newBooking) =>  {
        console.log("booking has been created:", newBooking);
        if (newBooking.roomId === this.room.id) {
          this.getBookings(this.room.id);
          this.calendar.getBookings();
        } else {
          this.roomService.getRoomFromId(newBooking.roomId).subscribe(
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
      },
      this.organizations,
      this.rooms,
      this.bookingService.getEmptyBooking(),
      this.room
    );
    // this.router.navigate(['/bookings/create'], { queryParams: { roomId: `${this.room.id}` } });
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //   // room: this.room.name,
    //   room: this.room,
    //   organizations: this.organizations,
    //   rooms: this.rooms,
    //   // rooms: this.rooms.map(room => room.name),
    // }

    // const dialogRef = this.dialog.open(BookingDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(
    //   data => {
    //     console.log("Dialog output:", data);
    //     let booking = this.bookingService.getEmptyBooking();
    //     booking.title = data.title;
    //     booking.details = data.description;
    //     booking.organizationId = data.organization.id;
    //     booking.roomId = data.room.id;
    //     booking.startDate = data.startDate;
    //     booking.endDate = data.endDate;
    //     booking.extras = data.extras;
    //     booking.totalPrice = data.totalPrice;
    //     this.bookingService.createBooking(booking).subscribe(
    //       (newBooking) => {
    //         console.log("booking has been created:", newBooking);
    //         if (booking.roomId === this.room.id) {
    //           this.getBookings(this.room.id);
    //           this.calendar.getBookings();
    //         } else {
    //           this.roomService.getRoomFromId(booking.roomId).subscribe(
    //             room => {
    //               this.router.navigate(['../', encodeURI(room.name)], {relativeTo: this.route, skipLocationChange: false}).then(
    //                 result => {
    //                   console.log("routing result=", result);
    //                   window.location.reload();
    //               },
    //               error => {
    //                 console.error("routing failed", error);
    //               })
    //             }
    //           )
    //         }
            
    //       }
    //     )
    //   }
    // );

    
  }

  duration (booking: Booking) {
    duration(booking);
  }


}
