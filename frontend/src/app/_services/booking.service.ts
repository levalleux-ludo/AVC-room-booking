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

  getBookings(opts?: {roomId?: string, day?: Date, dateFrom?: Date, dateTo?: Date}): Observable<Booking[]> {
    let url = this.buildUrl(`${this.apiBookings}?roomId=:roomId&day=:day&dateFrom=:dateFrom&dateTo=:dateTo`);
    if (opts && opts.roomId) url.setQueryParameter('roomId', encodeURI(opts.roomId));
    if (opts && opts.day) url.setQueryParameter('day', encodeURI(opts.day.toDateString()));
    if (opts && opts.dateFrom) url.setQueryParameter('dateFrom', encodeURI(opts.dateFrom.toDateString()));
    if (opts && opts.dateTo) url.setQueryParameter('dateTo', encodeURI(opts.dateTo.toDateString()));
    let finalUrl = url.get();
    this.log(`getBookings req=${finalUrl}`)
    return this.http.get<Booking[]>(finalUrl).pipe(
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
