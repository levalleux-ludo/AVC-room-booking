import { Component, OnInit } from '@angular/core';
import { InitDbService } from '../_services/init-db.service';
import { AuthenticationService } from '../_services';
import { RoomService } from '../_services/room.service';

@Component({
  selector: 'app-init-db',
  templateUrl: './init-db.component.html',
  styleUrls: ['./init-db.component.scss']
})
export class InitDBComponent implements OnInit {

  username = "mickey";
  password = "donald";
  firstName = "Walt";
  lastName = "Disney";
  user;
  rooms;

  constructor(
    private initDbService: InitDbService,
    private authenticationService: AuthenticationService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
  }

  createUser()
  {
    this.initDbService.createUser(
      this.username,
      this.password,
      this.firstName,
      this.lastName
    ).subscribe(
      _ => this.loginUser()
    );
  }

  loginUser()
  {
    this.authenticationService.login(
      this.username,
      this.password
    ).subscribe(
      user => this.user = JSON.stringify(user)
    );
  }

  createRooms() {
    this.rooms = [];
    [
      {name: "Conference", capacity: 20, rentRateHour: 9, rentRateDay: 50},
      {name: "Basement", capacity: 10, rentRateHour: 5, rentRateDay: 30},
      {name: "Thurston", capacity: 12, rentRateHour: 6, rentRateDay: 32},
      {name: "White", capacity: 6, rentRateHour: 4, rentRateDay: 25},
      {name: "Middle", capacity: 15, rentRateHour: 7, rentRateDay: 40}
    ].forEach(
      roomParam => {
        this.initDbService.createRoom(roomParam).subscribe(
          _ => this.getRoom(roomParam.name)
        );
      }
    )
  }

  getRoom(name) {
    this.roomService.getRoom(name).subscribe(
      room => {
        if (room)
          this.rooms.push(room)
      }
    );
  }
}
