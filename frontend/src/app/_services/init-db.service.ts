import { Injectable } from '@angular/core';
import { FetchService } from '../_helpers';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';

export interface User {
  username: string;
  firstName: string;

}

@Injectable({
  providedIn: 'root'
})
export class InitDbService extends FetchService {

  constructor(
    protected http: HttpClient
  ) {
    super('InitDb Service');
   }

  createUser(username, password, firstName, lastName) {
    return this.http.post<any>(`${environment.apiAuthentication}/users/register`, {username: username, password: password, firstName: firstName, lastName: lastName})
      .pipe(
        tap((newUser) => this.log(`User ${newUser.username} created`)),
        catchError(this.handleError<any>('createUser'))
      );
  }

  createRoom(roomParams) {
    return this.http.post<any>(`${environment.apiRoomBooking}/room/create`, roomParams)
      .pipe(
        tap((newRoom) => this.log(`Room ${newRoom.name} created`)),
        catchError(this.handleError<any>('createRoom'))
      );
  }

}
