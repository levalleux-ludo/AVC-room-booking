import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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
    private roomService: RoomService,
    private imageService: ImagesService,
    private sanitizer: DomSanitizer
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.roomService.getRooms().subscribe(
      rooms => {
        rooms.forEach(room => {
          this.imageService.getRoomImage(room).subscribe((imageUrl) => {
            this.rooms.push({name: room.name, img: imageUrl});
          });
        });
      });
  }

  getImage(imageUrl: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url("${imageUrl}")`);
  }

}
