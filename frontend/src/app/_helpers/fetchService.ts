import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RestURLBuilder } from 'rest-url-builder';

export class FetchService {

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
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error);

            // TODO: better job of transforming error for user consumption
            this.log_error(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result
            return of(result as T);
        }
    }
}