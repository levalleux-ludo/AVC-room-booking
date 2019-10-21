import { Component, OnInit } from '@angular/core';
import { Room } from '../model';
import { RoomService } from '../_services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Room[];

  constructor(
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe(
      rooms => this.rooms = rooms.map(room => new Room(room))
    );
  }

}
