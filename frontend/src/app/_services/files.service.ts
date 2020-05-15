import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';
import { Room } from '../_model';

const imageDir = 'assets/img';
const noPictureImage = imageDir + '/Picture_Not_Yet_Available.png';

@Injectable({
  providedIn: 'root'
})
export class FilesService extends FetchService {

  constructor(
    protected http: HttpClient
  ) {
    super('FilesService');
   }

   private apiFiles = `${environment.apiRoomBooking}/files`;
   filesUrl = new Map();

   httpOptions = {
     headers: new HttpHeaders({
       'Access-Control-Allow-Origin': '*'
     }),
     reportProgress: true
   };

   uploadFile(file: File): Observable<string> {
     const fd = new FormData();
     fd.append('file', file);

     return this.http.post<string>(`${this.apiFiles}/upload?filename=hello-world.txt`, fd, this.httpOptions).pipe(
         tap((imageId) => this.log(`uploaded file ${imageId}`))
       );

   }

   checkUrl(url: string): Observable<boolean> {
    return of(true);
  }

   getFileUrl(fileId: string): Observable<string> {
     if (this.filesUrl.has(fileId)) {
       return of(this.filesUrl.get(fileId));
     }
     const url = `${this.apiFiles}/${fileId}`;
     return this.http.get<any>(url)
       .pipe(
         tap(_ => this.log(`fetch fileUrl from Id "${fileId}"`)),
         catchError(this.handleError<any>(`getFileUrl(${fileId})`)),
         map((fileData) => {
           this.checkUrl(fileData.url).subscribe((result) => {
             if (result) {
               this.filesUrl.set(fileId, fileData.url);
             }
           });
           return fileData.url;
         })
       );
   }
}
