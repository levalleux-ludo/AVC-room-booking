import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Room } from '../_model';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';

const imageDir = "assets/img";
const roomImages = {
  "Conference Room": "ConferenceRoom.jpg",
  "Room One": "Room2.jpg",
  "Room Two": "Room2.jpg",
  "Conference": "ConferenceRoom.jpg",
  "Basement": "Room3.jpg",
  "White": "Room4.jpg",
  "Thurston": "Room5.jpg",
  "Middle": "Room6.jpg"
};


@Injectable({
  providedIn: 'root'
})
export class RoomService extends FetchService {

  private apiRooms = `${environment.apiRoomBooking}/room`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  }

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

  getRoomImage(roomName): string {
    return imageDir + '/' + roomImages[roomName];
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiRooms}/create`, room.getData(), this.httpOptions).pipe(
      tap((newRoom) => this.log(`created room ${newRoom}`)),
      catchError(this.handleError<Room>('createRoom'))
    )
  }

  updateRoom(room: Room): Observable<any> {
    const url = `${this.apiRooms}/${room.id}`;
    return this.http.put(url, room.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated room ${room.name}`)),
      catchError(this.handleError<any>('updateRoom'))
    );
  }

  deleteRoom(room: Room | number) : Observable<Room> {
    const id = typeof  room === 'number' ? room : room.id;
    const url = `${this.apiRooms}/${id}`;

    return this.http.delete<Room>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted room id=${id}`)),
      catchError(this.handleError<Room>('deleteRoom'))
    );
  }

}
