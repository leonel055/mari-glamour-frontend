import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreatePreferenceRequest {
  items: { productoId: string; cantidad: number }[];
  buyer: { nombre: string; email?: string; telefono?: string };
}

export interface CreatePreferenceResponse {
  pedidoId: string;
  preferenceId: string;
  initPoint: string;
}

export interface Pedido {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  total: number;
  estado: string;
  fecha: string;
  detalles: DetallePedido[];
  pago: Pago;
}

export interface DetallePedido {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precio: number;
}

export interface Pago {
  id: string;
  pedidoId: string;
  paymentId: string;
  preferenceId: string;
  estado: string;
  metodoPago: string;
  monto: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly API = `${environment.apiBase}/pagos`;

  constructor(private http: HttpClient) {}

  createPreference(req: CreatePreferenceRequest): Observable<CreatePreferenceResponse> {
    return this.http.post<CreatePreferenceResponse>(`${this.API}/create-preference`, req);
  }

  obtenerPedido(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API}/pedidos/${id}`);
  }
}
