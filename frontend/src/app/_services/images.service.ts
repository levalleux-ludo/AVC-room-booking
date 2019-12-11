import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';
import { Room } from '../_model';

const imageDir = "assets/img";
const noPictureImage = imageDir + '/Picture_Not_Yet_Available.png';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends FetchService {

  constructor(
    protected http: HttpClient
  ) {
    super('ImagesService');
   }

  private apiImages = `${environment.apiRoomBooking}/images`;
  imagesUrl = new Map();

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*'
    }),
    reportProgress: true
  };

  uploadImage(imageFile: File): Observable<string> {
    const fd = new FormData();
    fd.append('image', imageFile);

    // const req = new HttpRequest('POST', this.apiImages, {
    //   reportProgress: true
    // });

    return this.http.post<string>(`${this.apiImages}/upload?filename=hello-world.txt`, fd, this.httpOptions).pipe(
        tap((imageId) => this.log(`uploaded image ${imageId}`))
      );

  }

  checkUrl(url: string): Observable<boolean> {
    // return this.http.get<any>(url, { headers: new HttpHeaders({
    //   'Access-Control-Allow-Origin':'*'
    // })}).pipe(
    //   tap(
    //     () => true, // success
    //     () => false // failure
    //    )
    // );
    return of(true);
  }

  getImageUrl(imageId: string): Observable<string> {
    if (this.imagesUrl.has(imageId)) {
      return of(this.imagesUrl.get(imageId));
    }
    const url = `${this.apiImages}/${imageId}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log(`fetch imageUrl from Id "${imageId}"`)),
        catchError(this.handleError<any>(`getImageUrl(${imageId})`)),
        map((imgData) => {
          this.checkUrl(imgData.url).subscribe((result) => {
            if (result) {
              this.imagesUrl.set(imageId, imgData.url);
            }
          });
          return imgData.url;
        })
      );
  }

  getRoomImage(room: Room): Observable<string> {
    if (room.pictures && room.pictures.length > 0) {
      const imageId = room.pictures[0];
      return this.getImageUrl(imageId);
    }
    return of(noPictureImage);
  }

}
