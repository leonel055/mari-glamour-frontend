import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  producto: Partial<Producto> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    categoria: '',
    activo: true,
  };
  esEdicion = false;
  id = '';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.productoService.listar().subscribe((productos) => {
        const encontrado = productos.find((p) => p.id === this.id);
        if (encontrado) this.producto = encontrado;
        this.cdr.detectChanges();
      });
    }
  }

  onSubmit(): void {
    if (!this.producto.nombre) {
      this.toast.warning('Completa el nombre del producto');
      return;
    }
    if (!this.producto.precio) {
      this.toast.warning('Ingresa el precio del producto');
      return;
    }
    const obs = this.esEdicion
      ? this.productoService.editar(this.id, this.producto)
      : this.productoService.crear(this.producto);
    obs.subscribe({
      next: () => {
        this.toast.success(this.esEdicion ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/admin/productos']);
      },
      error: () => {
        this.toast.error('Error al guardar producto');
      },
    });
  }
}
