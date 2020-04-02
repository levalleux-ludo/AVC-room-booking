import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { WebsiteService } from 'src/app/_services/website.service';
import { Website } from 'src/app/_model/website';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;

  rooms: {name:string, img:string}[] = [];

  serviceDescription: string;

  constructor(
    private authenticationService: AuthenticationService,
    private roomService: RoomService,
    private imageService: ImagesService,
    private sanitizer: DomSanitizer,
    private websiteService: WebsiteService
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

    this.websiteService.get().subscribe((website: Website) => {
      this.serviceDescription = website.serviceDescription;
    });

  }

  getImage(imageUrl: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url("${imageUrl}")`);
  }

}
