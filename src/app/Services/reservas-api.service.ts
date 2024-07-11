import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppService } from '../api/app-service.service';
import { RequestStructure, TypeRequest } from '../api/models/request-api.model';
import { GetReserva } from '../app.component';
import { Habitacion, Reserva, Servicio } from '../Models/registro-models';
import { RequestReserva } from '../Models/request.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasApiService {
  TYPERQUEST = TypeRequest;

  constructor(private _appServices: AppService) {}

  GetReserva(filtro:GetReserva| null): Observable<Reserva[]> {
      const request: RequestStructure = {
        request: {
          type: TypeRequest.GET
        },
        params: {fechaInicio:filtro?.fechaInicio,fechaFin:filtro?.fechaFin,clienteId:filtro?.clienteId,servicioId:filtro?.servicioId},
        endpoint: 'api/ServicioReservado/GetReservas',
      };
      return this._appServices.sentRequest$(request).pipe(
        map((response:any)=>{
          if (response.isOk) {
            return response.result as Reserva[];
          }else{
            return [];
          }
        })
      );
  }
  GetServicios(): Observable<Servicio[]> {
    const request: RequestStructure = {
      request: {
        type: TypeRequest.GET
      },
      endpoint: 'api/ServicioReservado/GetServicio',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result as Servicio[];
        }else{
          return [];
        }
      })
    );
  }
  GetHabitacion():Observable<Habitacion[]>{
    const request: RequestStructure = {
      request: {
        type: TypeRequest.GET
      },
      endpoint: 'api/ServicioReservado/GetHabitacion',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result as Habitacion[];
        }else{
          return [];
        }
      })
    );
  }




  AddReserva(reserva:RequestReserva):Observable<Reserva | null>{
    const request: RequestStructure = {
      request: {
        type: TypeRequest.POST,
        body: reserva
      },
      endpoint: 'api/ServicioReservado/AddReserva',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result[0] as Reserva;
        }else{
          return null;
        }
      })
    );
  }


  UpdateReserva(data:RequestReserva):Observable<Reserva | null>{
    const request: RequestStructure = {
      request: {
        type: TypeRequest.PUT,
        body: data
      },
      endpoint: 'api/ServicioReservado/UpdateReserva',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result[0] as Reserva;
        }else{
          return null;
        }
      })
    );
  }

  CancelarReserva(data:Reserva):Observable<boolean>{
    const request: RequestStructure = {
      request: {
        type: TypeRequest.PUT,
        body: data
      },
      endpoint: 'api/ServicioReservado/CancelarReserva',
    };
    return this._appServices.sentRequest$(request).pipe(
      map((response:any)=>{
        if (response.isOk) {
          return response.result as boolean;
        }else{
          return false;
        }
      })
    );
  }


}
