export interface Curso {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  horario?: string;
  duracion?: number;
  precio: number;
  cupos: number;
  cuposDisponibles: number;
  temario?: { titulo: string; items: string[] }[];
  incluye?: string[];
  inscripcion?: number;
  imagen?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
