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
  animados = new Set<string>();

  productoSeleccionado: Producto | null = null;
  mostrarDetalle = false;

  private readonly WHATSAPP_NUM = '5493884427062';
  private readonly SKELETON_COUNT = 6;

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
        setTimeout(() => this.revealCards(), 100);
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private revealCards(): void {
    const el = document.querySelector('.catalogo-page');
    if (!el) return;
    const cards = el.querySelectorAll('.prod-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).dataset['index'] || '';
          this.animados.add(id);
          observer.unobserve(entry.target);
          this.cdr.detectChanges();
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    cards.forEach((c) => observer.observe(c));
  }

  filtrar(): void {
    const term = this.busqueda.toLowerCase().trim();
    this.filtrados = this.productos.filter((p) => {
      const matchBusqueda = !term
        || p.nombre.toLowerCase().includes(term)
        || (p.descripcion && p.descripcion.toLowerCase().includes(term))
        || (p.marca && p.marca.toLowerCase().includes(term));
      const matchCat = !this.categoriaSel || p.categoria === this.categoriaSel;
      return matchBusqueda && matchCat;
    });
    this.animados.clear();
    setTimeout(() => this.revealCards(), 50);
  }

  toggleCategoria(cat: string): void {
    this.categoriaSel = this.categoriaSel === cat ? '' : cat;
    this.filtrar();
  }

  abrirDetalle(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarDetalle = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    document.body.style.overflow = '';
  }

  consultarWhatsApp(nombre: string): void {
    const msg = encodeURIComponent(
      `Hola Mari, quisiera consultar por el producto "${nombre}".`
    );
    window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
  }

  imagenUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/')) return `https://mari-glamour-backend.onrender.com${url}`;
    return url;
  }

  formatoPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  }

  get skeletonArray(): number[] {
    return Array.from({ length: this.SKELETON_COUNT }, (_, i) => i);
  }
}
