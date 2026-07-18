import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../shared/interfaces/cliente.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly API = `${environment.apiBase}/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  crear(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, cliente);
  }

  editar(id: string, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API}/${id}`, cliente);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
