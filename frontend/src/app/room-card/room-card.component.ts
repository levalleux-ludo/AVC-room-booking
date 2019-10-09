import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../model';
import { RoomService } from '../_services/room.service';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit {

  constructor(
    private roomService: RoomService

  ) { }

  ngOnInit() {
  }

  _room: Room;
  image: string;
  set room(value: Room) {
    this._room = value;
    this.image = this.roomService.getRoomImage(this._room.name);
  }
  @Input()
  get room():Room {
    return this._room;
  }
}
