export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  duracion: number;
  precio: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
