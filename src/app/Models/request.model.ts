export interface RequestReserva {
  id?:                  string;
  fechaInicio:         Date;
  fechaFin:            Date;
  clienteId:           number;
  estado?:              boolean;
  serviciosReservados: RequesServiciosReservado[];
}

export interface RequesServiciosReservado {
  servicioId:   number;
  habitacionId: string | null;
  mesaId:       string | null;
  precioReal:   number;
}
