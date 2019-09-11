import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Room } from '../model';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends FetchService {

  private apiRooms = `${environment.apiRoomBooking}/room`;

  constructor(
    protected http: HttpClient
  ) {
    super('RoomService');
   }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiRooms)
      .pipe(
        tap(_ => this.log('fetched rooms')),
        catchError(this.handleError<Room[]>('getRooms', []))
      );
  }

  getRoom(roomName): Observable<Room> {
    const url = `${this.apiRooms}?name=${encodeURI(roomName)}`;
    this.log(`getRoom url=${url}`);
    return this.http.get<Room>(url)
      .pipe(
        tap(_ => this.log(`fetch room "${roomName}"`)),
        catchError(this.handleError<Room>(`getRoom(${roomName})`))
      );
  }

  getRoomFromId(roomId):Observable<Room> {
    const url = `${this.apiRooms}/${roomId}`;
    this.log(`getRoom url=${url}`);
    return this.http.get<Room>(url)
      .pipe(
        tap(_ => this.log(`fetch room from Id "${roomId}"`)),
        catchError(this.handleError<Room>(`getRoomFromId(${roomId})`))
      );
  }

}
