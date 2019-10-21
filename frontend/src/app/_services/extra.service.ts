import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Extra } from '../model/extra';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';

@Injectable({
  providedIn: 'root'
})
export class ExtraService extends FetchService {

  private apiExtras = `${environment.apiRoomBooking}/extra`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  }

  constructor(
    protected http: HttpClient
  ) {
    super('ExtraService');
   }

  getExtras(): Observable<Extra[]> {
    return this.http.get<Extra[]>(this.apiExtras)
      .pipe(
        tap(_ => this.log('fetched extras')),
        catchError(this.handleError<Extra[]>('getExtras', []))
      );
  }

  getExtra(extra): Observable<Extra> {
    const url = `${this.apiExtras}?name=${encodeURI(extra)}`;
    this.log(`getExtra url=${url}`);
    return this.http.get<Extra>(url)
      .pipe(
        tap(_ => this.log(`fetch extra "${extra}"`)),
        catchError(this.handleError<Extra>(`getExtra(${extra})`))
      );
  }

  getExtraFromId(extraId):Observable<Extra> {
    const url = `${this.apiExtras}/${extraId}`;
    this.log(`getExtra url=${url}`);
    return this.http.get<Extra>(url)
      .pipe(
        tap(_ => this.log(`fetch extra from Id "${extraId}"`)),
        catchError(this.handleError<Extra>(`getExtraFromId(${extraId})`))
      );
  }

  createExtra(extra: Extra): Observable<Extra> {
    return this.http.post<Extra>(`${this.apiExtras}/create`, extra.getData(), this.httpOptions).pipe(
      tap((newExtra) => this.log(`created extra ${newExtra}`)),
      catchError(this.handleError<Extra>('createExtra'))
    )
  }

  updateExtra(extra: Extra): Observable<any> {
    const url = `${this.apiExtras}/${extra.id}`;
    return this.http.put(url, extra.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated extra ${extra.name}`)),
      catchError(this.handleError<any>('updateExtra'))
    );
  }

  deleteExtra(extra: Extra | number) : Observable<Extra> {
    const id = typeof  extra === 'number' ? extra : extra.id;
    const url = `${this.apiExtras}/${id}`;

    return this.http.delete<Extra>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted extra id=${id}`)),
      catchError(this.handleError<Extra>('deleteExtra'))
    );
  }



}
