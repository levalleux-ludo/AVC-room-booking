import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { RoomService } from '../../_services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;

  rooms: {name:string, img:string}[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private roomService: RoomService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.roomService.getRooms().subscribe(
      rooms => {
        rooms.forEach(room => {
          let img = this.roomService.getRoomImage(room.name);
          this.rooms.push({name: room.name, img: img});
        })
      })
  }

}
