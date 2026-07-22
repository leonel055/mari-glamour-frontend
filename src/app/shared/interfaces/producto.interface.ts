export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  precio: number;
  imagen?: string;
  categoria?: string;
  stock: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
