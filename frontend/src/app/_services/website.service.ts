import { Injectable } from '@angular/core';
import { FetchService } from '../_helpers';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Website } from '../_model/website';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService extends FetchService {

  private apiWebsite = `${environment.apiRoomBooking}/website`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  constructor(
    protected http: HttpClient
  ) {
    super('WebsiteService');
  }

  public get(): Observable<Website> {
    return this.http.get<Website>(this.apiWebsite)
    .pipe(
      tap(_ => this.log('fetched website')),
      catchError(this.handleError<Website>('getWebsite', undefined))
    );
  }
}
