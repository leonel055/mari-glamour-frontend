import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MpEstado {
  conectado: boolean;
  mpUserId?: string;
  liveMode?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MpOauthService {
  private readonly API = `${environment.apiBase}/mp/oauth`;

  constructor(private http: HttpClient) {}

  getEstado(): Observable<MpEstado> {
    return this.http.get<MpEstado>(`${this.API}/estado`);
  }

  getAuthorizeUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.API}/authorize`);
  }
}
