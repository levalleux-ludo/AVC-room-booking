import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Booking, BookingPrivateData, RecurrencePatternParams, RecurrencePattern } from '../_model/booking';
import { FetchService } from '../_helpers';
import { tap, catchError, delayWhen, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends FetchService {

  private static instancesCount = 0;
  private apiBookings = `${environment.apiRoomBooking}/booking`;
  private _minBookingTime = 8;

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
          observer.complete();
        },
        (err) => {
          console.error(err);
          observer.error(err);
          observer.complete();
        });
      },
      (err) => {
        console.error(err);
        observer.error(err);
        observer.complete();
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

  createBookings(bookings: Booking[], privateDatas: BookingPrivateData[]): Observable<{ bookings: Booking[], errors: any[] }> {
    const bookingsParams = [];
    for (let i = 0; i < bookings.length; i++) {
      bookingsParams.push({...bookings[i], private: privateDatas[i]});
    }
    return this.http.post<any>(`${this.apiBookings}/create`, bookingsParams, this.httpOptions).pipe(
      tap(({ bookings: newBookings, errors }) => this.log(`created bookings events w/ ref=${newBookings}, error=${errors}`)),
      catchError(this.handleError<any>('createBookings'))
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
    return new Date().valueOf().toString() + BookingService.instancesCount++;
  }

  getEmptyBooking(): Booking {
    const MILLISEC_PER_DAY = 24 * 3600 * 1000;
    const tomorrow = new Date(Date.now() + MILLISEC_PER_DAY);
    return {
      id: undefined,
      ref: this.getNewRef(),
      startDate: new Date(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), this._minBookingTime),
      endDate: new Date(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), this._minBookingTime + 2),
      roomId: 0,
      nbPeopleExpected: 1,
      privateData: undefined,
      privateDataRef: {
      title: '',
      details: '',
      organizationId: '',
      extras: [],
      totalPrice: 0,
      hirersDetails: undefined,
      responsibleDetails: undefined
      },
      recurrencePatternId: null
    };
  }

  deleteBooking(bookingId: any) {
    const url = `${this.apiBookings}/${bookingId}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(() => this.log(`deleted booking event w/ ref=${bookingId}`)),
      catchError(this.handleError<Booking>('deleteBooking'))
    );
  }

  getBookingState(bookingId: any): Observable<string> {
    const url = `${this.apiBookings}/state/${bookingId}`;
    return this.http.get<string>(url, this.httpOptions).pipe(
      tap((state: string) => this.log(`get state of booking event w/ ref=${bookingId}: ${state}`)),
      catchError(this.handleError<string>('getBookingState'))
    );
  }

  getRecurrencePattern(patternId: any): Observable<RecurrencePattern> {
    const url = `${this.apiBookings}/recurrence/${patternId}`;
    return this.http.get<RecurrencePattern>(url, this.httpOptions).pipe(
      tap((pattern) => this.log(`get recurrence pattern  w/ ref=${patternId}: ${pattern}`)),
      catchError(this.handleError<RecurrencePattern>('getRecurrencePattern'))
    );
  }

  createRecurrencePattern(pattern: RecurrencePatternParams): Observable<RecurrencePattern> {
    return this.http.post<RecurrencePattern>(`${this.apiBookings}/recurrence/`, pattern, this.httpOptions).pipe(
      tap((newPattern) => this.log(`created pattern ${newPattern}`)),
      catchError(this.handleError<RecurrencePattern>('createRecurrencePattern'))
    );
  }

  updateRecurrencePattern(patternId: any, pattern: RecurrencePatternParams): Observable<RecurrencePattern> {
    const url = `${this.apiBookings}/recurrence/${patternId}`;
    return this.http.put(url, pattern, this.httpOptions).pipe(
      tap(_ => this.log(`updated pattern ${patternId}`)),
      catchError(this.handleError<any>('updateRecurrencePattern'))
    );
  }

}
