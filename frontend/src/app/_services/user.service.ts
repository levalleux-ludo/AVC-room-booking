import { Injectable } from '@angular/core';
import { User } from '../_model/user';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FetchService } from '../_helpers';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FetchService {

  private apiUsers = `${environment.apiRoomBooking}/users`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  constructor(
    protected http: HttpClient
  ) {
    super('UserService');
   }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsers)
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  updateUser(user: User): Observable<any> {
    const url = `${this.apiUsers}/${user.id}`;
    return this.http.put(url, user.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated user ${user.username}`)),
      catchError(this.handleError<any>('updateExtra'))
    );
  }

}
