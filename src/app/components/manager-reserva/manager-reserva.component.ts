import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { Cliente, Habitacion, Reserva, Servicio } from 'src/app/Models/registro-models';
import { RequestReserva } from 'src/app/Models/request.model';
import { ReservasApiService } from 'src/app/Services/reservas-api.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { requiredFormArray } from 'src/app/validators/validacion';

@Component({
  selector: 'app-manager-reserva',
  templateUrl: './manager-reserva.component.html',
  styleUrls: ['./manager-reserva.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NzModalModule,NzSelectModule,NzButtonModule,NzDatePickerModule,NzTableModule,NzIconModule],
})
export class ManagerReservaComponent {
  form:FormGroup = new FormGroup({});//SE CREA UN FORMULARIO
  readonly #modal = inject(NzModalRef);//SE INYECTA EL MODAL
  readonly nzData: Reserva = inject(NZ_MODAL_DATA);//SE INYECTA LOS DATOS DEL MODAL
  clientes:Observable<Cliente[]> = this._usuarioService.GetCliente();//SE OBTIENEN LOS CLIENTES
  servicios:Observable<Servicio[]> = this._reservasApi.GetServicios();//SE OBTIENEN LOS SERVICIOS
  habitaciones:Observable<Habitacion[]> = this._reservasApi.GetHabitacion();//SE OBTIENEN LAS HABITACIONES
  loadingManager:boolean = false;//SE CREA UNA VARIABLE PARA EL LOADING PARA CUANDO GUARDEN O EDITEN
constructor(private _fb:FormBuilder,private _reservasApi:ReservasApiService,private _usuarioService:UsuarioService) {
  //SE INICIALIZA EL FORMULARIO
  this.initForm();
  //SI EXISTE UNA RESERVA SE SETEA EL FORMULARIO
  if (this.nzData) {
    this.setForm(this.nzData);
  }
}//METODO QUE INICIALIZA EL FORMULARIO
initForm(): void {
  this.form = this._fb.group({
    id: [null],
    fechaInicio: [null,Validators.required],
    fechaFin: [null,Validators.required],
    clienteId: [null,Validators.required],
    serviciosReservados: this._fb.array([],requiredFormArray),
    servicio: [null],
    habitacion: [null],
  });
}
//METODO QUE SETEA LOS VALORES DEL FORMULARIO PARA EDITAR
setForm(data:Reserva):void{
  this.form.patchValue({
    id: data.id,
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,
    clienteId: data.cliente.id,
    servicio: [null],
    habitacion: [null],
  });
  this.serviciosReservados.clear();

  data.serviciosReservados.forEach(servicio => {
    this.serviciosReservados.push(this._fb.group({
      servicioId: [servicio.id, Validators.required],
      nombreServicio: [servicio.nombreServicio, Validators.required],
      precioReal: [servicio.precioReal, Validators.required],
      fechaServicio: [servicio.fechaServicio, Validators.required],
      habitacion: [servicio.habitacion],
      mesa: [null],
    }));
  });
  this.form.controls['clienteId'].disable();
}
//METODO QUE DEVUELVE EL CONTROL DE SERVICIOS RESERVADOS DEL FORMULARIO
get serviciosReservados(): FormArray {
  return this.form.get('serviciosReservados') as FormArray;
}
//METODO QUE DEVUELVE EL TOTAL DE SERVICIOS RESERVADOS
get totalServiciosReservados(): number {
  const total = this.serviciosReservados.controls.reduce((acc,control)=>{
    return acc + control.value.precioReal;
  } ,0);
  return total
}
//METODO QUE AGREGA UNA TABLA TEMPORAL DE SERVICIOS RESERVADOS
agregarTablaTemporal():void{
  if (this.form.value.servicio && this.form.value.servicio.tipoServicio.isHabitacion) {
    const servicioExistente = this.serviciosReservados.controls.some(control => {
      return control.value.servicioId === this.form.value.servicio.id&&
             control.value.habitacion.id === this.form.value.habitacion.id;
    });
    if (servicioExistente) {
      alert('Ya existe este servicio');
      return ;
    }
    const nuevoServicio =this._fb.group({
      servicioId: this.form.value.servicio.id,
      nombreServicio: this.form.value.servicio.nombreServicio,
      precioReal: this.form.value.habitacion.precio,
      fechaServicio: this.form.value.fechaServicio,
      habitacion: this.form.value.habitacion,
      mesa: null,
    })
    this.serviciosReservados.push(nuevoServicio);

  } else {
    const servicioExistente = this.serviciosReservados.controls.some(control => {
      return control.value.servicioId === this.form.value.servicio.id;
    });
    if (servicioExistente) {
      alert('Ya existe este servicio ');
      return ;
    }
    const nuevoServicio =this._fb.group({
      servicioId: this.form.value.servicio.id,
      nombreServicio: this.form.value.servicio.nombreServicio,
      precioReal: this.form.value.servicio.precioReal,
      fechaServicio: this.form.value.fechaServicio,
      habitacion: null,
      mesa: null,
    })
    this.serviciosReservados.push(nuevoServicio);
  }

}
eliminarDeTablaTemporal(index:number):void{
  this.serviciosReservados.removeAt(index);
}
cancelar(): void {
 this.#modal.close();
}
//METODO QUE GUARDA UNA RESERVA
guardar(): void {

    if (this.form.valid) {
      this.loadingManager = true;
      const request:RequestReserva={
        fechaInicio: this.form.value.fechaInicio,
        fechaFin: this.form.value.fechaFin,
        clienteId: this.form.value.clienteId,
        estado: true,
        serviciosReservados: this.form.value.serviciosReservados.map((servicio:any)=>{
          return {
            servicioId: servicio.servicioId,
            habitacionId: servicio.habitacion? servicio.habitacion.id : null,
            mesaId: null,
            precioReal:  servicio.precioReal,
          }
        }),
      }
      this._reservasApi.AddReserva(request).subscribe((response)=>{
        if (response) {
          this.loadingManager = false
          this.#modal.close(response);
        }
      }
      )
    }
}
//METODO QUE EDITA UNA RESERVA
editar(): void {
    if (this.form.valid) {
      this.loadingManager = true;
      const formValue = this.form.getRawValue();
      const request:RequestReserva={
        id: this.form.value.id,
        fechaInicio: formValue.fechaInicio,
        fechaFin: formValue.fechaFin,
        clienteId:formValue.clienteId,
        estado: true,
        serviciosReservados:formValue.serviciosReservados.map((servicio:any)=>{
          return {
            servicioId: servicio.servicioId,
            habitacionId: servicio.habitacion? servicio.habitacion.id : null,
            mesaId: null,
            precioReal:  servicio.precioReal,
          }
        }),
      }
      this._reservasApi.UpdateReserva(request).subscribe((response)=>{
        if (response) {
          this.loadingManager = false
          this.#modal.close(response);
        }
      }
      )
    }
}
}
