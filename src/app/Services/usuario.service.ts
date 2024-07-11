import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppService } from '../api/app-service.service';
import { RequestStructure, TypeRequest } from '../api/models/request-api.model';
import { Cliente } from '../Models/registro-models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _appServices:AppService) { }
  GetCliente():Observable<Cliente[]>{
    const request: RequestStructure = {
      request: {
        type: TypeRequest.GET
      },
      endpoint: 'api/Usuario/GetCliente',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result as Cliente[];
        }else{
          return [];
        }
      })
    );
  }
}
