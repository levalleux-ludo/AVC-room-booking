import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Booking, BookingPrivateData } from '../_model/booking';
import { FetchService } from '../_helpers';
import { tap, catchError, delayWhen, map } from 'rxjs/operators';

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

  // tslint:disable-next-line: max-line-length
  getBookings(opts?: {roomId?: string, day?: Date, startBefore?: Date, startAfter?: Date, endBefore?: Date, endAfter?: Date}): Observable<Booking[]> {
    // tslint:disable-next-line: max-line-length
    let url = this.buildUrl(`${this.apiBookings}?roomId=:roomId&day=:day&startBefore=:startBefore&startAfter=:startAfter&endBefore=:endBefore&endAfter=:endAfter`);
    if (opts && opts.roomId) { url.setQueryParameter('roomId', encodeURI(opts.roomId)); }
    if (opts && opts.day) { url.setQueryParameter('day', encodeURI(opts.day.toDateString())); }
    if (opts && opts.startBefore) { url.setQueryParameter('startBefore', encodeURI(opts.startBefore.toUTCString())); }
    if (opts && opts.startAfter) { url.setQueryParameter('startAfter', encodeURI(opts.startAfter.toDateString())); }
    if (opts && opts.endBefore) { url.setQueryParameter('endBefore', encodeURI(opts.endBefore.toUTCString())); }
    if (opts && opts.endAfter) { url.setQueryParameter('endAfter', encodeURI(opts.endAfter.toDateString())); }
    const finalUrl = url.get();
    this.log(`getBookings req=${finalUrl}`)
    return new  Observable<Booking[]>((observer) => {
      this.http.get<any[]>(finalUrl).pipe(
        map(bookingParams => bookingParams.map(bookingParam => new Booking(bookingParam))),
        catchError(this.handleError<Booking[]>('getBookings', []))
      ).subscribe(bookings => {
        this.getBookingsPrivateData().subscribe(privateDataMap => {
          bookings.forEach(booking => {
            if (privateDataMap.has(booking.privateData)) {
              booking.privateDataRef = privateDataMap.get(booking.privateData);
            }
          });
          observer.next(bookings);
        },
        (err) => {
          console.error(err);
          observer.error(err);
        });
      },
      (err) => {
        console.error(err);
        observer.error(err);
      });
    });
  }

  getBookingsPrivateData(): Observable<Map<any, any>> {
    let url = `${this.apiBookings}/private`;
    return this.http.get<any[]>(url).pipe(
      tap(privateDatas => {
        this.log('fetched bookings private data:' + privateDatas);
      }),
      map(privateDatas => {
        const privateDataMap = new Map<any, any>();
        for (const privateData of privateDatas) {
          privateDataMap.set(privateData.id, privateData);
        }
        return privateDataMap;
      }),
      catchError(this.handleError<Map<any, any>>('getBookingsPrivateData'))
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

  createBooking(booking: Booking, privateData: BookingPrivateData): Observable<Booking> {
    const bookingParams = {...booking, private: privateData};
    return this.http.post<Booking>(`${this.apiBookings}/create`, bookingParams, this.httpOptions).pipe(
      tap((newBooking: Booking) => this.log(`created booking event w/ ref=${newBooking.ref}`)),
      catchError(this.handleError<Booking>('createBooking'))
    );
  }

  updateBooking(booking: Booking, privateData: BookingPrivateData): Observable<Booking> {
    const bookingParams = {...booking, private: privateData};
    const url = `${this.apiBookings}/${booking.id}`;
    return this.http.put<Booking>(url, bookingParams, this.httpOptions).pipe(
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
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
      privateData: undefined,
      privateDataRef: {
      title: '',
      details: '',
      organizationId: '',
      extras: [],
      totalPrice: 0
      }
    };
  }

}
