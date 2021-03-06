import { Component, OnInit, ViewChild, Directive, AfterViewChecked, Input, ElementRef, Renderer2, Output, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../_services/room.service';
import { Location } from '@angular/common';
import { Room } from '../../_model';
import { Booking, duration } from '../../_model/booking';
import { BookingService } from '../../_services/booking.service';
import { MatDialog, MatDialogConfig, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { RoomCalendarComponent } from '../room-calendar/room-calendar.component';
import { ExtraService } from '../../_services/extra.service';
import { Extra } from '../../_model/extra';
import { OrganizationService } from '../../_services/organization.service';
import { Organization } from '../../_model/organization';
import { Observable, of } from 'rxjs';
import { ImagesService } from 'src/app/_services/images.service';
import { inject } from '@angular/core/testing';
import { DialogCarouselComponent } from '../dialog-carousel/dialog-carousel.component';
import { AuthenticationService, AuthorizationRules } from 'src/app/_services';
import { UserService } from 'src/app/_services/user.service';
import { RecurrentEventService } from 'src/app/_services/recurrent-event.service';
import { PdfCreatorService } from 'src/app/_services/pdf-creator.service';
import { CryptoService } from 'src/app/_services/crypto.service';
import { FilesService } from 'src/app/_services/files.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Directive({
  selector: '[appSetImageToCenter]'
})
export class SetImageToCenterDirective implements AfterViewChecked {

  constructor(
    private img: ElementRef,
    private _renderer: Renderer2
  ) { }

  ngAfterViewChecked(): void {
    const px: number = parseInt(this.img.nativeElement.parentNode.style.width.replace("px", ""), 10);
    const py: number = parseInt(this.img.nativeElement.parentNode.style.height.replace("px", ""), 10);
    const ix: number = this.img.nativeElement.naturalWidth;
    const iy: number = this.img.nativeElement.naturalHeight;
    const style: any = {};

    if (ix / iy == 1) {
      if (px / py == 1) {
        style.width = "100%";
        style.height = "100%";
      } else if (px / py > 1) {
        style.width = (py + "px").toString();
        style.height = (py + "px").toString();
        style["margin-left"] = (((px - py) / 2) + "px").toString();
      } else {
        style.width = (px + "px").toString();
        style.height = (px + "px").toString();
        style["margin-top"] = (((py - px) / 2) + "px").toString();
      }
    } else if (ix / iy > 1) {
      if (px / py == 1) {
        style.width = (px + "px").toString();
        style.height = ((px / ix * iy) + "px").toString();
        style["margin-top"] = (((py - (px / ix * iy)) / 2) + "px").toString();
      } else if (px / py > 1) {
        if (py/px < iy/ix) {
          // height = 100%
          style.height = (py + "px").toString();
          style.width = ((py / iy * ix) + "px").toString();
          style["margin-left"] = (((px - (py / iy * ix)) / 2) + "px").toString();
        } else {
          // width = 100%;
          style.width = (px + "px").toString();
          style.height = ((px / ix * iy) + "px").toString();
          style["margin-top"] = (((py - (px / ix * iy)) / 2) + "px").toString();
        }
      } else {
        style.width = (px + "px").toString();
        style.height = ((px / ix * iy) + "px").toString();
        style["margin-top"] = (((py - (px / ix * iy)) / 2) + "px").toString();
      }
    } else {
      if (px / py == 1) {
        style.height = (py + "px").toString();
        style.width = ((py / iy * ix) + "px").toString();
        style["margin-left"] = (((px - (py / iy * ix)) / 2) + "px").toString();
      } else if (px / py > 1) {
        style.height = (py + "px").toString();
        style.width = ((py / iy * ix) + "px").toString();
        style["margin-left"] = (((px - (py / iy * ix)) / 2) + "px").toString();
      } else {
        if (py/px > iy/ix) {
          // height = 100%
          style.height = (py + "px").toString();
          style.width = ((py / iy * ix) + "px").toString();
          style["margin-left"] = (((px - (py / iy * ix)) / 2) + "px").toString();
        } else {
          // width = 100%;
          style.width = (px + "px").toString();
          style.height = ((px / ix * iy) + "px").toString();
          style["margin-top"] = (((py - (px / ix * iy)) / 2) + "px").toString();
        }
      }
    }

    for (let key in style) {
      this._renderer.setStyle(this.img.nativeElement, key, style[key]);
    }
  }

}

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  @ViewChild('calendar', {static: false}) calendar: RoomCalendarComponent;

  _displayDate = Date.now();

  _room: Room;
  @Input()
  set room(value: Room) {
    this._room = value;
    if (this._room) {
      this.getBookings(this._room.id);
      this.getImages(this._room);
    }
  }
  get room(): Room {
    return this._room;
  }

  get roomDescription(): string {
    if (this.room) {
      return atob(this.room.descriptionHTML);
    }
    return `<div></div>`;
  }

  images: string[] = [];

  pastBookings: Booking[];
  nextBookings: Booking[];
  rooms: Room[];
  organizations: Organization[];
  loggedIn = false;
  bookingAllowed = false;

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
    private imagesService: ImagesService,
    private authenticationService: AuthenticationService,
    private recurrentEventService: RecurrentEventService,
    private userService: UserService,
    private pdfCreatorService: PdfCreatorService,
    private cryptoService: CryptoService,
    private filesService: FilesService,
    private notificationService: NotificationService,
    private location: Location, // required to get back in navigation history
    private dialog: MatDialog, // required to open a dialog
    public bottomSheetRef: MatBottomSheetRef<RoomDetailComponent>, // required to integrate the component in the 'bottomSheet'
    @Inject(MAT_BOTTOM_SHEET_DATA) public data?: any
  ) {
    if (this.data && this.data.room) {
      console.log('injected room', this.data.room.name);
      this.room = this.data.room;
    }
    // If today is already Friday-Sat-Sun, then display next week by default in availabilities
    const now = new Date(Date.now());
    if ((now.getDay() === 0) // Sunday
      || (now.getDay() === 5) // Friday
      || (now.getDay() === 6) // Saturday
    ) {
      const MILLISEC_PER_DAY = 24 * 3600 * 1000;
      // 0 => +1
      // 6 => +2
      // 5 => +3
      // x => (8 - x) % 7
      const nextMonday = new Date(now.getTime() + ((8 - now.getDay() ) % 7) * MILLISEC_PER_DAY);
      this._displayDate = nextMonday.getTime();
    }

   }

  ngOnInit() {
    // this.getRoom();
    this.getAllRooms();
    this.extraService.refreshExtras();
    this.loggedIn = (this.authenticationService.currentUserValue !== undefined);
    this.bookingAllowed = this.authenticationService.currentUserValue
     && (AuthorizationRules.BOOKINGS.includes(this.authenticationService.currentUserValue.role)
      || AuthorizationRules.MYBOOKINGS.includes(this.authenticationService.currentUserValue.role));
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

  // getRoom(): void {
  //   const name = this.route.snapshot.paramMap.get('name');
  //   console.log("RoomDetailComponent get room name from URL :", name);
  //   this.roomService.getRoom(name).subscribe(
  //     room => {
  //       this.room = new Room(room);
  //       this.getBookings(this.room.id);
  //       this.getImages(this.room);
  //     });
  // }

  getBookings(room: Room): void {
    this.pastBookings = [];
    this.nextBookings = [];
    if (!room) {
      return;
    }
    let now = new Date();
    let yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()-1);
    this.bookingService.getBookings({
      cancelled: false,
      roomId: room.id,
      endBefore: now
    }).subscribe(
      bookings => this.pastBookings = bookings
    );
    this.bookingService.getBookings({
      cancelled: false,
      roomId: room.id,
      endAfter: now
    }).subscribe(
      bookings => this.nextBookings = bookings
    );
  }

  getImages(room: Room): void {
    this.images.splice(0, this.images.length);
    room.pictures.forEach((imageId) => {
      this.imagesService.getImageUrl(imageId).subscribe((imageUrl) => this.images.push(imageUrl));
    });
  }

  goBack() {
    this.location.back();
  }

  bookNow() {
    BookingDialogComponent.editBooking(
      this.dialog,
      this.bookingService,
      this.recurrentEventService,
      this.pdfCreatorService,
      this.cryptoService,
      this.filesService,
      this.notificationService,
      this.organizationService,
      this.authenticationService,
      this.userService,
      (newBooking, privateData) =>  {
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

  magnify(img: any) {
    console.log('magnify img=', img);
    this.dialog.open(DialogCarouselComponent, {
      data: {
        image: img,
        images: this.images
      },
      width: '100vw'
    });
  }


}
