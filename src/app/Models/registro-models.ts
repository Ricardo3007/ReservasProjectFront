



export interface usuarioCanguro  {
    id : string,
    nombre : string,
    password: string,
    estado:boolean
}
export interface Reserva {
    id?:                  number;
    fechaInicio:         Date;
    fechaFin:            Date;
    cliente:             Cliente;
    estado?:              boolean;
    serviciosReservados: ServiciosReservado[];
}

export interface Cliente {
    id:       number;
    nombre:   string;
    email:    string;
    telefono: null;
}

export interface ServiciosReservado {
    id:             number;
    nombreServicio: string;
    precioReal:     number;
    fechaServicio:  Date;
    habitacion:     null;
    mesa:           null;
}
export interface Servicio {
    id:             number;
    nombreServicio: string;
    precioReal:     number;
    fechaServicio:  Date;
    habitacion:     null;
    mesa:           null;
    tipoServicio:   TipoServicio;
}

export interface TipoServicio {
    id:            number;
    nombre:        string;
    isHabitacion:  boolean;
    isRestaurante: boolean;
    fechaCreacion: Date;
    estado:        boolean;
}

export interface Habitacion {
    id:           number;
    numeroCuarto: string;
    numeroCamas:  number;
    numeroBanos:  null;
    precio:       number;
}
