import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';
import { SessionService } from './session.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private _sesionServicio: SessionService, private router: Router, private http: HttpClient,private _auth :AuthService,
   
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this._sesionServicio.token();
    if(token){
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + token,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
           
            this.router.navigate(["/login"]);

            return EMPTY;
          case 403:
            this.router.navigate(["/login"]);
            return EMPTY;
          default:
            return next.handle(request);
        }
      })
    );
  }
}
