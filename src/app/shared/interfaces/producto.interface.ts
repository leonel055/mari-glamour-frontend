export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  categoria?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
