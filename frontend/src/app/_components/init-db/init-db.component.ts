import { Component, OnInit } from '@angular/core';
import { InitDbService } from '../../_services/init-db.service';
import { AuthenticationService } from '../../_services';
import { RoomService } from '../../_services/room.service';
import { Room } from '../../_model';

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
  rooms: Room[];

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
      {name: "Conference", descriptionHTML: btoa(`<font face="Times New Roman" size="7">The room Conference is wonderfull.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`), capacity: 20, rentRateHour: 9, rentRateDay: 50},
      {name: "Basement", descriptionHTML: btoa(`<font face="Times New Roman" size="7">The room Basement is wonderfull.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`), capacity: 10, rentRateHour: 5, rentRateDay: 30},
      {name: "Thurston", descriptionHTML: btoa(`<font face="Times New Roman" size="7">The room Thurston is wonderfull.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`), capacity: 12, rentRateHour: 6, rentRateDay: 32},
      {name: "White", descriptionHTML: btoa(`<font face="Times New Roman" size="7">The room White is wonderfull.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`), capacity: 6, rentRateHour: 4, rentRateDay: 25},
      {name: "Middle", descriptionHTML: btoa(`<font face="Times New Roman" size="7">The room Middle is wonderfull.</font><div><font face="Arial"><br></font></div><div><font face="Arial">How are you today ?</font></div><div><font face="Arial">This is awesome, isn't it ?</font></div><div><ol><li><font face="Arial">one bla lab la bla</font></li></ol></div><div><font face="Arial"><br></font></div>`), capacity: 15, rentRateHour: 7, rentRateDay: 40}
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
          this.rooms.push(new Room(room))
      }
    );
  }
}
