import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../shared/interfaces/curso.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly API = `${environment.apiBase}/cursos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API);
  }

  crear(curso: Partial<Curso>): Observable<Curso> {
    return this.http.post<Curso>(this.API, curso);
  }

  editar(id: string, curso: Partial<Curso>): Observable<Curso> {
    return this.http.put<Curso>(`${this.API}/${id}`, curso);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
