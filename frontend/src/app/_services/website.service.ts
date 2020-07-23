import { Injectable } from '@angular/core';
import { FetchService } from '../_helpers';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Website } from '../_model/website';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService extends FetchService {

  private apiWebsite;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  constructor(
    protected http: HttpClient,
    protected apiUrlService: ApiUrlService
  ) {
    super('WebsiteService');
    this.apiUrlService.apiUrl.subscribe((url) => {
      this.apiWebsite = `${url}/website`;
    });
  }

  public get(): Observable<Website> {
    return this.http.get<Website>(this.apiWebsite)
    .pipe(
      tap(_ => this.log('fetched website')),
      catchError(this.handleError<Website>('getWebsite', undefined))
    );
  }

  update(website: Website): Observable<any> {
    const url = `${this.apiWebsite}`;
    return this.http.put(url, website.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated website ${website.getData()}`)),
      catchError(this.handleError<any>('updateWebsite'))
    );
  }

  public getBackgroundImageUrl(): string {
    return `${this.apiWebsite}/background`;
  }

}
