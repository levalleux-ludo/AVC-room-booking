import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Notifier } from '../_model/notifier';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends FetchService {

  apiNotifier = `${environment.apiRoomBooking}/notifier`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json',  'Access-Control-Allow-Origin': '*' }),
  };

  constructor(
    protected http: HttpClient
  ) {
    super('NotifierService');
  }

  onCreateBooking(report: { encryptionKey: string; formId: string; bookingId: string; nextOccurrencesId: any[]; }): Observable<any> {
    return this.http.post<any>(`${this.apiNotifier}/booking/${report.bookingId}`, {}, this.httpOptions).pipe(
      tap(() => this.log(`notified creation booking ${report.bookingId}`)),
      catchError(this.handleError<any>('onCreateBooking'))
    );
  }

  onUpdateBooking(report: { encryptionKey: string; formId: string; bookingId: string; nextOccurrencesId: any[]; }): Observable<any> {
    return of(null);
  }
  onDeleteBooking(report: { encryptionKey: string; formId: string; bookingId: string; nextOccurrencesId: any[]; }): Observable<any> {
    return of(null);
  }

  public get(): Observable<Notifier> {
    return this.http.get<Notifier>(this.apiNotifier)
    .pipe(
      tap(_ => this.log('fetched notifier')),
      catchError(this.handleError<Notifier>('getNotifier', undefined))
    );
  }

  update(notifier: Notifier): Observable<any> {
    const url = `${this.apiNotifier}`;
    return this.http.put(url, notifier.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated notifier ${notifier.getData()}`)),
      catchError(this.handleError<any>('updateNotifier'))
    );
  }
}
