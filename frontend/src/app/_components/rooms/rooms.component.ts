import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from '../../_model';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { MatSidenav, MatBottomSheet } from '@angular/material';
import { RoomDetailComponent } from '../room-detail/room-detail.component';
import { AuthenticationService } from 'src/app/_services';
import { WaiterService } from 'src/app/_services/waiter.service';

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
    private authenticationService: AuthenticationService,
    private waiter: WaiterService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.loggedIn = (this.authenticationService.currentUserValue !== undefined)
     && (this.authenticationService.currentUserValue !== null)
     && (this.authenticationService.currentUserValue !== '');
  }

  getRooms(): void {
    const waiterTask = this.waiter.addTask();
    this.roomService.getRooms().subscribe(
      rooms => {
        this.rooms = rooms.map(room => new Room(room));
        this.waiter.removeTask(waiterTask);
      }, err => {
        alert(err);
        this.waiter.removeTask(waiterTask);
      });
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
