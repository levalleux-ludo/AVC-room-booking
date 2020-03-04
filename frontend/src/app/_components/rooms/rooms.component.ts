import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from '../../_model';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { Observable } from 'rxjs';
import { MatSidenav, MatBottomSheet } from '@angular/material';
import { RoomDetailComponent } from '../room-detail/room-detail.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];

  selectedRoom: Room;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  constructor(
    private roomService: RoomService,
    private imagesService: ImagesService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.getRooms();
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
    this.selectedRoom = room;
    this.bottomSheet.open(RoomDetailComponent, {data: {room: room}});

  }

}
