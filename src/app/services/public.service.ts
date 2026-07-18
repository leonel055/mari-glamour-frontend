import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../shared/interfaces/servicio.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly API = `${environment.apiBase}/public`;

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.API}/servicios`);
  }

  getDisponibilidad(fecha: string, servicioIds: string[]): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/disponibilidad`, {
      params: { fecha, servicioIds: servicioIds.join(',') },
    });
  }
}
