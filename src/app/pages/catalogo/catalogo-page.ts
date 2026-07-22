import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../shared/interfaces/producto.interface';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-page.html',
  styleUrl: './catalogo-page.css',
})
export class CatalogoPage implements OnInit {
  productos: Producto[] = [];
  filtrados: Producto[] = [];
  busqueda = '';
  categoriaSel = '';
  categorias: string[] = [];
  cargando = true;

  private readonly WHATSAPP_NUM = '5493884427062';
  private readonly BACKEND = 'https://mari-glamour-backend.onrender.com';

  constructor(
    private publicService: PublicService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.publicService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrados = data;
        this.categorias = [...new Set(data.map((p) => p.categoria).filter(Boolean))] as string[];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrar(): void {
    const term = this.busqueda.toLowerCase().trim();
    this.filtrados = this.productos.filter((p) => {
      const matchBusqueda = !term
        || p.nombre.toLowerCase().includes(term)
        || (p.descripcion && p.descripcion.toLowerCase().includes(term));
      const matchCat = !this.categoriaSel || p.categoria === this.categoriaSel;
      return matchBusqueda && matchCat;
    });
  }

  toggleCategoria(cat: string): void {
    this.categoriaSel = this.categoriaSel === cat ? '' : cat;
    this.filtrar();
  }

  consultarProducto(nombre: string): void {
    const msg = encodeURIComponent(`Hola! Me interesa el producto: ${nombre}.`);
    window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
  }

  formatoPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  }

  imagenUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/')) return `${this.BACKEND}${url}`;
    return url;
  }
}
