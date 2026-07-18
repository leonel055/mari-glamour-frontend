import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno, TurnoCrear } from '../shared/interfaces/turno.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private readonly API = `${environment.apiBase}/turnos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.API);
  }

  crear(turno: TurnoCrear): Observable<Turno> {
    return this.http.post<Turno>(this.API, turno);
  }

  editar(id: string, data: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.API}/${id}`, data);
  }

  cancelar(id: string): Observable<Turno> {
    return this.http.patch<Turno>(`${this.API}/${id}/cancelar`, {});
  }

  disponibles(fecha: string, servicioIds: string[]): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/disponibles`, {
      params: { fecha, servicioIds: servicioIds.join(',') },
    });
  }
}
