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
    marca: '',
    precio: 0,
    imagen: '',
    categoria: '',
    stock: 0,
    activo: true,
  };
  esEdicion = false;
  id = '';
  subiendo = false;
  previewUrl = '';
  archivoSeleccionado: File | null = null;
  imagenesExtra: string[] = [];

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
      this.productoService.obtener(this.id).subscribe({
        next: (producto) => {
          this.producto = { ...producto, stock: producto.stock ?? 0 };
          this.previewUrl = producto.imagen || '';
          this.imagenesExtra = (producto as any).imagenes?.map((i: any) => i.imagen) || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.toast.error('Error al cargar producto');
          this.router.navigate(['/admin/productos']);
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      this.toast.warning('Formato no valido. Usa JPG, PNG o WebP');
      return;
    }
    this.archivoSeleccionado = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.archivoSeleccionado = null;
    this.previewUrl = '';
    this.producto.imagen = '';
  }

  agregarImagenExtra(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      this.toast.warning('Formato no valido. Usa JPG, PNG o WebP');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenesExtra.push(reader.result as string);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  eliminarImagenExtra(index: number): void {
    this.imagenesExtra.splice(index, 1);
  }

  onSubmit(): void {
    this.producto.stock = Number(this.producto.stock) || 0;
    this.producto.precio = Number(this.producto.precio) || 0;

    if (!this.producto.nombre) {
      this.toast.warning('Completa el nombre del producto');
      return;
    }
    if (!this.producto.precio) {
      this.toast.warning('Ingresa el precio del producto');
      return;
    }

    const payload = {
      ...this.producto,
      imagenes: this.imagenesExtra,
    };

    if (this.archivoSeleccionado) {
      this.subiendo = true;
      this.cdr.detectChanges();
      this.productoService.subirImagen(this.archivoSeleccionado).subscribe({
        next: (res) => {
          payload.imagen = res.url;
          this.guardar(payload);
        },
        error: () => {
          this.subiendo = false;
          this.toast.error('Error al subir imagen');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.guardar(payload);
    }
  }

  private guardar(payload: any): void {
    const obs = this.esEdicion
      ? this.productoService.editar(this.id, payload)
      : this.productoService.crear(payload);
    obs.subscribe({
      next: () => {
        this.subiendo = false;
        this.toast.success(this.esEdicion ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/admin/productos']);
      },
      error: () => {
        this.subiendo = false;
        this.toast.error('Error al guardar producto');
        this.cdr.detectChanges();
      },
    });
  }
}
