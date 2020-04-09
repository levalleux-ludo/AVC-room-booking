import { Injectable } from '@angular/core';
import { User, eUserRole } from '../_model/user';
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

  // private apiRoles = {
  //   Customer: 'customer',
  //   AvcStaff: 'staff',
  //   AvcAdmin: 'admin',
  //   SysAdmin: 'sysAdmin'
  // };
  private apiRoles = new Map<string, string>([
    [eUserRole.CUSTOMER, 'customer'],
    [eUserRole.AVC_STAFF, 'staff'],
    [eUserRole.AVC_ADMIN, 'admin'],
    [eUserRole.SYS_ADMIN, 'sysAdmin']
  ]);

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

  // updateUser(user: User): Observable<any> {
  //   const url = `${this.apiUsers}/${user.id}`;
  //   return this.http.put(url, user.getData(), this.httpOptions).pipe(
  //     tap(_ => this.log(`updated user ${user.username}`)),
  //     catchError(this.handleError<any>('updateUser'))
  //   );
  // }

  changeRole(user: User): Observable<any> {
      const url = `${this.apiUsers}/${this.apiRoles.get(user.role)}`;
      console.log('apiRoles', this.apiRoles);
      console.log('Update user role @API:', url, 'role', user.role);
      return this.http.post<User>(url, {userId: user.id}, this.httpOptions).pipe(
        tap((updatedUser) => this.log(`change role of user ${updatedUser.username} into ${updatedUser.role}`)),
        catchError(this.handleError<User>('changeRole'))
      );
    }

  changeMemberOf(user: User): Observable<any> {
    const url = `${this.apiUsers}/${user.id}/memberOf`;
    console.log('Update user memberOf @API:', url, 'memberOf', user.memberOf);
    return this.http.put<User>(url, user.memberOf, this.httpOptions).pipe(
      tap((updatedUser) => this.log(`change memberOf of user ${updatedUser.username} into ${updatedUser.memberOf}`)),
      catchError(this.handleError<User>('changeMemberOf'))
    );
  }

  register (user) {
    return this.http.post(`${this.apiUsers}/register`, user).pipe(
      tap(() => this.log(`register user ${user.username}`)),
      catchError(this.handleError<User>('register'))
    );
}

}
