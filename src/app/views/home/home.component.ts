import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';
import { GetReserva } from 'src/app/app.component';
import { ManagerReservaComponent } from 'src/app/components/manager-reserva/manager-reserva.component';
import { Cliente, Reserva, Servicio } from 'src/app/Models/registro-models';
import { ReservasApiService } from 'src/app/Services/reservas-api.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { SessionService } from 'src/app/utils/session.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    FormsModule,
    NzPageHeaderModule,
    NzButtonModule,NzTableModule,
    NzModalModule,NzIconModule,
    NzSelectModule,NzDatePickerModule,
    NzPopoverModule,NzListModule]
})
export class HomeComponent {
  clientes:Observable<Cliente[]> = this._usuarioService.GetCliente();//SE OBTIENEN LOS CLIENTES
  servicios:Observable<Servicio[]> = this.reservaServices.GetServicios();//SE OBTIENEN LOS SERVICIOS
  reservas:Reserva[] = [];//SE CREA UN ARREGLO DE RESERVAS
  loadingReservas:boolean = false;//SE CREA UNA VARIABLE PARA EL LOADING
  //SE CREA UN FORMULARIO
  form:FormGroup = new FormGroup({
    clienteId: new FormControl(null),
    servicioId: new FormControl(null),
    fechaInicio: new FormControl(null),
    fechaFin: new FormControl(null),
  });
  clicked:boolean = false;//SE CREA UNA VARIABLE PARA EL FILTRO DE LAS RESERVAS

  constructor(private reservaServices:ReservasApiService,private _usuarioService:UsuarioService,private modal: NzModalService,private _fb:FormBuilder,private _sessionService:SessionService,private _route: Router){
    this.loadingReservas = true;
    this.loadReservas(null);//CARGO LAS RESERVAS AL INICIAR LA PAGINA SIN FILTROS

  }
  //METODO PARA CARGAR LAS RESERVAS
  loadReservas(filtro:GetReserva| null){
    this.loadingReservas = true;
    this.reservaServices.GetReserva(filtro?filtro:null).subscribe(reservas=>{
      this.reservas = reservas;
      this.loadingReservas = false;
    })
  }
  //METODO QUE ABRE EL MODAL PARA CREAR O EDITAR UNA RESERVA
  managerReservaModal(reserva?:Reserva):void{
    const modal = this.modal.create<ManagerReservaComponent,any>({
      nzTitle: reserva? 'Editar Reserva' : 'Nueva Reserva',
      nzContent: ManagerReservaComponent,
      nzWidth:'70%',
      nzData: reserva,//DATA QUE LE PASO AL COMPONENTE POR INJECCION
      nzFooter:null,
      nzMaskClosable:false,
    })
    modal.afterClose.subscribe((result:Reserva) =>
    {
      if (result) {
        if (reserva) {//SI EXISTE EL ARGUNTO RESER ES ACTUALIZACION
          this.reservas = this.reservas.map(reserva=>{
                    if (reserva.id == result.id) {
                      return result;
                    }else{
                      return reserva;
                    }
          });
        }
        else{//SINO ES UNA RESERVA NUEVA
          this.reservas= [...this.reservas,result];
        }

      }

    }
    );
  }
  //METODO PARA CANCELAR UNA RESERVA
  cancelarReserva(reserva:Reserva):void{
    let reservaCancelada:Reserva={
      ...reserva,
      estado:false
    }
    this.reservaServices.CancelarReserva(reservaCancelada).subscribe(res=>{
      if (res) {
        this.reservas = this.reservas.filter((r)=>r.id != reserva.id);
      }
    })
  }
  //METODO PARA FILTRAR LAS RESERVAS O LIMPIAR EL FILTRO
  filtrar(clic:boolean):void{
    const filtros:GetReserva={
      ...this.form.value,
      fechaInicio:this.form.value.fechaInicio?this.form.value.fechaInicio.toISOString():null,
      fechaFin:this.form.value.fechaFin?this.form.value.fechaFin.toISOString():null
    }
    this.clicked = clic;
    this.loadReservas(!this.clicked? null: filtros);
    if (!this.clicked) {
      this.form.reset();
    }
  }
  cerrarSesion():void{
    this._sessionService.limpiarSesion();
    this._route.navigate(['login']);

  }
}
