export interface Usuario {
  id: string;
  email: string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}
