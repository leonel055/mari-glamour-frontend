import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../shared/interfaces/servicio.interface';
import { ServicioService } from '../../../services/servicio.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicio-list.html',
  styleUrl: './servicio-list.css',
})
export class ServicioList implements OnInit {
  servicios: Servicio[] = [];

  constructor(
    private servicioService: ServicioService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data;
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

  eliminarServicio(servicio: Servicio, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Eliminar servicio "${servicio.nombre}"?`)) return;
    this.servicioService.eliminar(servicio.id).subscribe({
      next: () => {
        this.toast.success('Servicio eliminado');
        this.cargar();
      },
      error: () => {
        this.toast.error('Error al eliminar servicio');
      },
    });
  }
}
