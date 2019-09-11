import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Booking } from '../model/booking';
import { FetchService } from '../_helpers';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends FetchService {

  private apiBookings = `${environment.apiRoomBooking}/booking`;


  constructor(
    protected http: HttpClient
  ) {
    super('BookingService');
   }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiBookings).pipe(
      tap(_ => this.log('fetched bookings')),
      catchError(this.handleError<Booking[]>('getBookings', []))
    );
  }

  getBooking(ref): Observable<Booking> {
    const url = `${this.apiBookings}?ref=${encodeURI(ref)}`;
    this.log(`getRoom url=${url}`);
    return this.http.get<Booking>(url)
      .pipe(
        tap(_ => this.log(`fetch booking "${ref}"`)),
        catchError(this.handleError<Booking>(`getBooking(${ref})`))
      );
  }
}
