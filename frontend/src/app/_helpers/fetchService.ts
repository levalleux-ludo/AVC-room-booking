import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { RestURLBuilder } from 'rest-url-builder';

export class FetchService {

    protected httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json' })
      }

    constructor(protected serviceName: string) {
    }

    protected buildUrl(url): RestURLBuilder {
        let builder = new RestURLBuilder();
        return builder.buildRestURL(url);
    }

    protected log_error(message: string) {
        console.error(`${this.serviceName}: ${message}`);
    }

    protected log(message: string) {
        console.log(`${this.serviceName}: ${message}`);
    }

    protected handleError<T> (operation = 'operation', result?: T) {
        return (errorResponse: HttpErrorResponse): Observable<T> => {
            this.log_error(`${operation} failed: ${errorResponse.message} ${errorResponse.error ? JSON.stringify(errorResponse.error) : ''}`);

            // // Let the app keep running by returning an empty result
            // return of(result as T);
            return throwError(`${operation} failed: ${errorResponse.message} ${errorResponse.error ? JSON.stringify(errorResponse.error) : ''}`);
        }
    }
}
