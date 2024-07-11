import { Component } from '@angular/core';

//INTERFAZ PARA LOS FILTROS DE LAS RESERVAS
export interface  GetReserva{
  fechaInicio:any;
  fechaFin:any;
  servicioId:string;
  clienteId:string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:false
})
export class AppComponent {
  title = 'reservasProject';//TITULO DE LA PAGINA

}
