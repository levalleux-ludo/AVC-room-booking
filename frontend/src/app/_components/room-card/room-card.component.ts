import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../../_model';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit {

  constructor(
    private roomService: RoomService,
    private imagesService: ImagesService
  ) { }

  ngOnInit() {
  }

  _room: Room;
  image: string;
  set room(value: Room) {
    this._room = value;
    this.imagesService.getRoomImage(this._room).subscribe(
      (imageUrl) => this.image = imageUrl
    );
  }
  @Input()
  get room():Room {
    return this._room;
  }
}
