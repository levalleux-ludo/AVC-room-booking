import { Injectable } from '@angular/core';
import { FetchService } from '../_helpers';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class InitDbService extends FetchService {

  constructor(
    protected http: HttpClient,
    protected apiUrlService: ApiUrlService
  ) {
    super('InitDb Service');
   }

  createUser(username, password, firstName, lastName) {
    return this.http.post<any>(`${this.apiUrlService.userApiUrl.value}/users/register`, {username: username, password: password, firstName: firstName, lastName: lastName})
      .pipe(
        tap((newUser) => this.log(`User ${newUser.username} created`)),
        catchError(this.handleError<any>('createUser'))
      );
  }

  createRoom(roomParams) {
    return this.http.post<any>(`${this.apiUrlService.apiUrl.value}/room/create`, roomParams)
      .pipe(
        tap((newRoom) => this.log(`Room ${newRoom.name} created`)),
        catchError(this.handleError<any>('createRoom'))
      );
  }

}
