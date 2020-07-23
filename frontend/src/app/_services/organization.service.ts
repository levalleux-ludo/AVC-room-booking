import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Organization } from '../_model/organization';
import { environment } from 'src/environments/environment';
import { FetchService } from '../_helpers';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends FetchService {

  private apiOrganizations;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  }

  constructor(
    protected http: HttpClient,
    protected apiUrlService: ApiUrlService
  ) {
    super('OrganizationService');
    this.apiUrlService.apiUrl.subscribe((url) => {
      this.apiOrganizations = `${url}/organization`;
    });
   }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiOrganizations)
      .pipe(
        tap(_ => this.log('fetched organizations')),
        catchError(this.handleError<Organization[]>('getOrganizations', []))
      );
  }

  getOrganization(organization): Observable<Organization> {
    const url = `${this.apiOrganizations}?name=${encodeURI(organization)}`;
    this.log(`getOrganization url=${url}`);
    return this.http.get<Organization>(url)
      .pipe(
        tap(_ => this.log(`fetch organization "${organization}"`)),
        catchError(this.handleError<Organization>(`getOrganization(${organization})`))
      );
  }

  getOrganizationFromId(organizationId):Observable<Organization> {
    const url = `${this.apiOrganizations}/${organizationId}`;
    this.log(`getOrganization url=${url}`);
    return this.http.get<Organization>(url)
      .pipe(
        tap(_ => this.log(`fetch organization from Id "${organizationId}"`)),
        catchError(this.handleError<Organization>(`getOrganizationFromId(${organizationId})`))
      );
  }

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiOrganizations}/create`, organization.getData(), this.httpOptions).pipe(
      tap((newOrganization) => this.log(`created organization ${newOrganization}`)),
      catchError(this.handleError<Organization>('createOrganization'))
    )
  }

  updateOrganization(organization: Organization): Observable<any> {
    const url = `${this.apiOrganizations}/${organization.id}`;
    return this.http.put(url, organization.getData(), this.httpOptions).pipe(
      tap(_ => this.log(`updated organization ${organization.name}`)),
      catchError(this.handleError<any>('updateOrganization'))
    );
  }

  deleteOrganization(organization: Organization | number) : Observable<Organization> {
    const id = typeof  organization === 'number' ? organization : organization.id;
    const url = `${this.apiOrganizations}/${id}`;

    return this.http.delete<Organization>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted organization id=${id}`)),
      catchError(this.handleError<Organization>('deleteOrganization'))
    );
  }



}
