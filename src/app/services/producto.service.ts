import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../shared/interfaces/producto.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly API = `${environment.apiBase}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API);
  }

  crear(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(this.API, producto);
  }

  editar(id: string, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API}/${id}`, producto);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
