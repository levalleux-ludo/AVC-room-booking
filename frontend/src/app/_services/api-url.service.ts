import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  apiUrl: BehaviorSubject <string>;
  userApiUrl: BehaviorSubject <string>;
  constructor(
    public route: ActivatedRoute,
    protected httpBackend: HttpBackend
  ) {
    this.apiUrl = new BehaviorSubject(null);
    this.userApiUrl = new BehaviorSubject(null);
    this.route.queryParams.subscribe((params) => {
      console.log('route params', params);
      if (params.api_url !== undefined) {
        this.apiUrl.next(params.api_url);
        this.userApiUrl.next(params.api_url);
        localStorage.setItem('api_url', params.api_url);
        this.testUrl(params.api_url).subscribe(() => {
          console.log('Set API URL: ', params.api_url);
        }, err => {
          console.error('Invalid apiUrl', params.api_url);
        });
      } else {
        const oldUrl = localStorage.getItem('api_url');
        console.log('get old url', oldUrl);
        if (oldUrl) {
          this.apiUrl.next(oldUrl);
          this.userApiUrl.next(oldUrl);
          this.testUrl(oldUrl).subscribe(() => {
            console.log('Set API URL: ', oldUrl);
          }, err => {
            console.error('Invalid apiUrl', oldUrl);
          });
        }
      }
    });
  }
  testUrl(apiUrl: string): Observable<any> {
    // see https://medium.com/mikes-fullstack-ladder/how-to-skip-http-interceptor-dee136e54a5f
    const http = new HttpClient(this.httpBackend);
    return http.get(apiUrl, {responseType: 'text'});
  }
}
