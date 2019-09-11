import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../_services/room.service';
import { Location } from '@angular/common';
import { Room } from '../model';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  room: Room;

  constructor(
    private route: ActivatedRoute, // required to parse th current URL and find the room's name
    private roomService: RoomService,
    private location: Location // required to get back in navigation history
  ) { }

  ngOnInit() {
    this.getRoom();
  }

  getRoom(): void {
    const name = this.route.snapshot.paramMap.get('name');
    console.log("RoomDetailComponent get room name from URL :", name);
    this.roomService.getRoom(name).subscribe(
      room => this.room = room
    );
  }

  goBack() {
    this.location.back();
  }

}
