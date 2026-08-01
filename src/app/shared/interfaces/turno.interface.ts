import { Cliente } from './cliente.interface';
import { Servicio } from './servicio.interface';

export interface Turno {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'FINALIZADO' | 'CANCELADO' | 'REPROGRAMADO';
  observaciones?: string;
  clienteId: string;
  servicioId: string;
  servicioIds?: string[];
  costoAdicional?: number;
  usuarioId?: string;
  metodoReserva?: 'MANUAL' | 'WHATSAPP' | 'ONLINE';
  montoSenia?: number;
  seniaPagada?: boolean;
  paymentId?: string;
  preferenceId?: string;
  reservaExpira?: string;
  clienteNombre?: string;
  clienteWhatsApp?: string;
  Cliente?: Cliente;
  Servicio?: Servicio;
  ServiciosExtra?: Servicio[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TurnoCrear {
  clienteId: string;
  servicioId?: string;
  servicioIds: string[];
  fecha: string;
  horaInicio: string;
  costoAdicional?: number;
  observaciones?: string;
}
