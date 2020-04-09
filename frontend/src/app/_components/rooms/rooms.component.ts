import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from '../../_model';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { MatSidenav, MatBottomSheet } from '@angular/material';
import { RoomDetailComponent } from '../room-detail/room-detail.component';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];

  selectedRoom: Room;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  loggedIn = false;

  constructor(
    private roomService: RoomService,
    private imagesService: ImagesService,
    private bottomSheet: MatBottomSheet,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.loggedIn = (this.authenticationService.currentUserValue !== undefined)
     && (this.authenticationService.currentUserValue !== null)
     && (this.authenticationService.currentUserValue !== '');
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe(
      rooms => this.rooms = rooms.map(room => new Room(room))
    );
  }

  getImage(room: Room): Observable<string> {
    return this.imagesService.getRoomImage(room);
  }

  showDetails(room: Room) {
    if (!this.loggedIn) {
      alert('You need to login to see details about our rooms. Please Sign In or Register!');
      return;
    }
    this.selectedRoom = room;
    this.bottomSheet.open(RoomDetailComponent, {data: {room: room}});

  }

}
