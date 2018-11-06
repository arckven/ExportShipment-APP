import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../guard/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {



  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'x-auth-token': `${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {

          if (event instanceof HttpResponse) {
            console.log('response', event);
          }

        },
        (err: any) => {
          console.log('error');
          if (err.status === 401 || err.status === 403) {
            console.log('handle error here', err);
          }

        }
      )
    );

  }


}
