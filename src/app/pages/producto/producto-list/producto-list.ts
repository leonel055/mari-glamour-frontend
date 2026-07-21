import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Error al cargar productos');
      },
    });
  }

  eliminar(producto: Producto): void {
    if (!confirm(`Eliminar "${producto.nombre}"?`)) return;
    this.productoService.eliminar(producto.id).subscribe({
      next: () => {
        this.toast.success('Producto eliminado');
        this.cargar();
      },
      error: () => {
        this.toast.error('Error al eliminar producto');
      },
    });
  }
}
