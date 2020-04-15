import { Injectable } from '@angular/core';
import { FetchService } from '../_helpers';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BookingsConfig } from '../_model/bookingsConfig';

@Injectable({
  providedIn: 'root'
})
export class BookingsConfigService extends FetchService {
  private apiBookingsConfig = `${environment.apiRoomBooking}/bookings-config`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  constructor(
    protected http: HttpClient
  ) {
    super('BookingsConfigService');
  }

  public get(): Observable<BookingsConfig> {
    return this.http.get<BookingsConfig>(this.apiBookingsConfig)
    .pipe(
      tap(_ => this.log('fetched BookingsConfig')),
      catchError(this.handleError<BookingsConfig>('getBookingsConfig', undefined))
    );
  }

  update(bookingsConfig: BookingsConfig): Observable<any> {
    const url = `${this.apiBookingsConfig}`;
    return this.http.put(url, bookingsConfig.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated bookingsConfig ${bookingsConfig.getData()}`)),
      catchError(this.handleError<any>('updateBookingsConfig'))
    );
  }
}



