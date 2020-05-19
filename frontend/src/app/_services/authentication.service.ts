import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { eUserRole, User } from '../_model/user';

export const AuthorizationRules = {
  MYBOOKINGS: [eUserRole.CUSTOMER],
  BOOKINGS: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN],
  CONFIGURE: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN]
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
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
        return this.http.post<any>(`${environment.apiAuthentication}/users/authenticate`, { username, password })
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
}
