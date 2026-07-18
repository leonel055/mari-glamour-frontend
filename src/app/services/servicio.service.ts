import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../shared/interfaces/servicio.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly API = `${environment.apiBase}/servicios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.API);
  }

  crear(servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(this.API, servicio);
  }

  editar(id: string, servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.API}/${id}`, servicio);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
