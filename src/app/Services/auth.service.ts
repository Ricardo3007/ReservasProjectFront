import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TypeRequest } from '../api/models/request-api.model';
import { SessionService } from '../utils/session.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  TYPERQUEST = TypeRequest;

  constructor(private _sesionServicio: SessionService, private _skipInterceptor: HttpBackend,private notification: NzNotificationService) { }
  signIn(data: any) {

      let headers: any = new HttpHeaders({
          Accept: "application/x-www-form-urlencoded",
          skip: "true",
      });
      const _http = new HttpClient(this._skipInterceptor);
      return _http.post(environment.api_url + "api/Usuario/Login", data, { headers }).pipe(
          map((res: any) => {
            if (res!=null) {
               this._sesionServicio.setSesion(res.token);
              return res;
            }else{
              alert("credenciales incorrectas")
            }
          }),
          catchError(this.handle)
      )

  }
  handle(error:HttpErrorResponse){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código del error: ${error.status}\nMensaje: ${error.message}`;
    }
   alert("credenciales incorrectas")
    
    return throwError(() => new Error(errorMessage));
  }
}
