import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Curso } from '../../../shared/interfaces/curso.interface';
import { CursoService } from '../../../services/curso.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curso-list.html',
  styleUrl: './curso-list.css',
})
export class CursoList implements OnInit {
  cursos: Curso[] = [];

  constructor(
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cursoService.listar().subscribe({
      next: (data) => {
        this.cursos = data;
        this.cdr.detectChanges();
      },
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T12:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]}`;
  }

  eliminarCurso(curso: Curso, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Eliminar curso "${curso.nombre}"?`)) return;
    this.cursoService.eliminar(curso.id).subscribe({
      next: () => {
        this.toast.success('Curso eliminado');
        this.cargar();
      },
      error: () => {
        this.toast.error('Error al eliminar curso');
      },
    });
  }
}
