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

  getBookings(opts?: {roomId?: string, day?: Date, startBefore?: Date, startAfter?: Date, endBefore?: Date, endAfter?: Date}): Observable<Booking[]> {
    let url = this.buildUrl(`${this.apiBookings}?roomId=:roomId&day=:day&startBefore=:startBefore&startAfter=:startAfter&endBefore=:endBefore&endAfter=:endAfter`);
    if (opts && opts.roomId) url.setQueryParameter('roomId', encodeURI(opts.roomId));
    if (opts && opts.day) url.setQueryParameter('day', encodeURI(opts.day.toDateString()));
    if (opts && opts.startBefore) url.setQueryParameter('startBefore', encodeURI(opts.startBefore.toUTCString()));
    if (opts && opts.startAfter) url.setQueryParameter('startAfter', encodeURI(opts.startAfter.toDateString()));
    if (opts && opts.endBefore) url.setQueryParameter('endBefore', encodeURI(opts.endBefore.toUTCString()));
    if (opts && opts.endAfter) url.setQueryParameter('endAfter', encodeURI(opts.endAfter.toDateString()));
    let finalUrl = url.get();
    this.log(`getBookings req=${finalUrl}`)
    return this.http.get<Booking[]>(finalUrl).pipe(
      tap(bookings => {
        this.log('fetched bookings:' + bookings);
        bookings.forEach(booking => {booking.startDate = new Date(booking.startDate); booking.endDate = new Date(booking.endDate);})
        return bookings;
      }),
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

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiBookings}/create`, booking, this.httpOptions).pipe(
      tap((newBooking: Booking) => this.log(`created booking event w/ ref=${newBooking.ref}`)),
      catchError(this.handleError<Booking>('createBooking'))
    )
  }

  updateBooking(booking: Booking): Observable<Booking> {
    const url = `${this.apiBookings}/${booking.id}`;
    return this.http.put<Booking>(url, booking, this.httpOptions).pipe(
      tap((newBooking: Booking) => this.log(`created booking event w/ ref=${newBooking.ref}`)),
      catchError(this.handleError<Booking>('createBooking'))
    )
  }

  getNewRef(): string {
    return new Date().valueOf().toString();
  }

  getEmptyBooking(): Booking {
    return {
      id: undefined,
      ref: this.getNewRef(),
      title: '',
      details: '',
      organizationId: '',
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
      extras: [],
      totalPrice: 0
    };
  }

}
