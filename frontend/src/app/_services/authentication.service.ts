import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { eUserRole } from '../_model/user';

export const AuthorizationRules = {
  BOOKINGS: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN, eUserRole.CUSTOMER],
  CONFIGURE: [eUserRole.AVC_STAFF, eUserRole.AVC_ADMIN, eUserRole.SYS_ADMIN]
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        const localStoredUser = localStorage.getItem('currentUser');
        const jsonUser = JSON.parse(localStoredUser);
        this.currentUserSubject = new BehaviorSubject<any>(jsonUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        return this.http.post<any>(`${environment.apiAuthentication}/users/authenticate`, { username, password })
        .pipe(map(user => {
            // store user details and  jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
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
