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
  imagenes?: ProductoImagen[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductoImagen {
  id: string;
  productoId: string;
  imagen: string;
  orden: number;
}
