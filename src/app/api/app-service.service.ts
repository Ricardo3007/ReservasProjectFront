import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import {
  PostRequest,
  PutRequest,
  RequestStructure,
  StatusMessagesRequest,
  TypeRequest
} from './models/request-api.model';
import { RequestApi } from './models/response-api.model';
/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _headers = new HttpHeaders();
  private _params = new HttpParams();

  constructor(
    private _http: HttpClient,
    private _skipInterceptor: HttpBackend,
  ) {}

  sentRequest$<T>(requestStructure: RequestStructure): Observable<RequestApi<T>> {
    const http = requestStructure.skipInterceptor ? new HttpClient(this._skipInterceptor) : this._http;
    this.overwriteParams(requestStructure.params);
    this.overwriteHeaders(requestStructure.headers);
    let response$: Observable<RequestApi<T>>

          const apiUrl = environment.api_url+ requestStructure.endpoint;

          switch (requestStructure.request.type) {
            case TypeRequest.DELETE:
              response$= http.delete<RequestApi<T>>(apiUrl, {
                headers: this._headers,
                params: this._params
              });
              break;
            case TypeRequest.POST:
              response$= http.post<RequestApi<T>>(apiUrl, (requestStructure.request as PostRequest).body, {
                headers: this._headers,
                params: this._params
              });
              break;
            case TypeRequest.PUT:
              response$=  http.put<RequestApi<T>>(apiUrl, (requestStructure.request as PutRequest).body, {
                headers: this._headers,
                params: this._params
              });
              break;
            default:
              response$=  http.get<RequestApi<T>>(apiUrl, {
                headers: this._headers,
                params: this._params
              });
          }


    return this.processResponse$<T>(response$, requestStructure.statusMessages);
  }

  /**
   * @param response$
   * @param { StatusMessagesRequest } [statusMessages] - Mensajes de estado de la petición. Ver mas en {@link StatusMessagesRequest}
   * @returns { Observable<ResponseStructure> } - Observable con la respuesta del servidor procesada. Si la petición fue exitosa, se retorna un objeto con la respuesta del servidor, si no, se retorna un objeto con el error. Ver mas en {@link ResponseStructure}.
   */
  private processResponse$<T>(
    response$: Observable<RequestApi<T>>,
    statusMessages?: StatusMessagesRequest
  ): Observable<RequestApi<T>> {
    return response$.pipe(
      map((resp) => {
        if (statusMessages?.success) {
         alert(statusMessages?.success);
        }
        return resp;
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          let message;
          if (error.status >= 400 && error.status < 500) {
            message = error.error?.message;
          } else if (error.status >= 500) {
            message = error.error?.message;
          } else {
            message = 'Error desconocido';
          }
          if (statusMessages?.showDefaultErrorMessage) {
            alert(message);
          } else if (statusMessages?.error) {
          alert(statusMessages?.error);
          }
        }
        throw error;
      })
    );
  }
  /**
   * Metodo que se encarga de sobreescribir los params de la petición.
   * @param {object | undefined} params - Parametros de la petición.
   */
  private overwriteParams(params: { [key: string]: string | number | boolean | undefined | null } | undefined): void {
    let newParams = new HttpParams();
    if (params) {
      for (const key in params) {
        const value = params[key];
        if (Object.prototype.hasOwnProperty.call(params, key) && value) {
          newParams = newParams.set(key, value);
        }
      }
      this._params = newParams;
    } else {
      this._params = newParams;
    }
  }
  /**
   * Metodo que se encarga de sobreescribir los headers de la petición.
   * @param {object | undefined} headers - Parametros de la petición.
   */
  private overwriteHeaders(headers: { [key: string]: string } | undefined): void {
    if (headers) {
      let newHeaders = new HttpHeaders({
        Accept: 'application/json'
      });
      for (const key in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, key)) {
          newHeaders = newHeaders.set(key, headers[key]);
        }
      }
      this._headers = newHeaders;
    }
  }
}
