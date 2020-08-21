import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { eUserRole, User } from '../_model/user';
import { ApiUrlService } from './api-url.service';

export const AuthorizationRules = {
  MYBOOKINGS: [eUserRole.CUSTOMER],
  BOOKINGS: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN],
  CONFIGURE: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN]
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
      private http: HttpClient,
      protected apiUrlService: ApiUrlService
      ) {
        const localStoredUser = localStorage.getItem('currentUser');
        let user = undefined;
        if (localStoredUser) {
          const jsonUserData = JSON.parse(localStoredUser);
          user = new User(jsonUserData);
        }
        this.currentUserSubject = new BehaviorSubject<User>(user);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        return this.http.post<any>(`${this.apiUrlService.userApiUrl.value}/users/authenticate`, { username, password })
        .pipe(map(userData => {
            // store user details and  jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(userData));
            const user = new User(userData);
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    refresh() {
      const url = `${this.apiUrlService.userApiUrl.value}/users/current`;
      this.http.get<any>(url)
      .pipe(map(userData => {
          if (this.currentUserValue && this.currentUserValue.token) {
            userData.token = this.currentUserValue.token;
          }
          // store user details and  jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(userData));
          const user = new User(userData);
          this.currentUserSubject.next(user);
          return user;
      })).subscribe(() => {});
    }
}
