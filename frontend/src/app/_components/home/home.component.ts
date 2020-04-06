import { Component, OnInit, ElementRef, ViewChild, Directive, Input, HostBinding } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { RoomService } from '../../_services/room.service';
import { ImagesService } from 'src/app/_services/images.service';
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser';
import { WebsiteService } from 'src/app/_services/website.service';
import { Website } from 'src/app/_model/website';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;

  website: Website;

  images: string[] = [];

  backgroundPicture = '';

  constructor(
    private authenticationService: AuthenticationService,
    private imagesService: ImagesService,
    public sanitizer: DomSanitizer,
    private websiteService: WebsiteService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    // this.backgroundPicture = this.websiteService.getBackgroundImageUrl();
   }

  ngOnInit() {
    this.websiteService.get().subscribe((website: Website) => {
      this.website = new Website(website);
      this.website.pictures.forEach((imageId) => {
        this.imagesService.getImageUrl(imageId).subscribe((imageUrl) => this.images.push(imageUrl));
      });
      this.imagesService.getImageUrl(website.backgroundPicture).subscribe((imageUrl) => {
        console.log("set backgroundPicture", imageUrl);
        this.backgroundPicture = imageUrl;
      });

    });

  }

  @HostBinding("attr.style")
  public get backgroundPictureAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--background-image: url("${this.backgroundPicture}")`);
  }


  getImage(imageUrl: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url("${imageUrl}")`);
  }

}
