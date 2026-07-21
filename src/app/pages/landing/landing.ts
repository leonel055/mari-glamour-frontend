import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Curso } from '../../shared/interfaces/curso.interface';
import { Producto } from '../../shared/interfaces/producto.interface';

interface DiaDisponibilidad {
  nombre: string;
  fecha: string;
  fechaCorta: string;
  horariosLibres: string[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy, AfterViewInit {
  servicioSeleccionado = '';
  serviciosDisponibles: { id: string; nombre: string }[] = [];
  semana: DiaDisponibilidad[] = [];
  diaActualIndex = 0;
  cargando = false;
  navbarVisible = false;

  heroSlide = 0;
  private heroInterval: any;
  private scrollHandler: any;

  readonly heroSlides = [
    { image: 'assets/hero-1.jpg' },
    { image: 'assets/hero-2.jpg' },
    { image: 'assets/hero-3.jpg' },
  ];

  readonly serviciosLanding = [
    { imagen: 'assets/serv-softgel.jpg', nombre: 'Soft Gel', desc: 'Acabado natural y resistente.', duracion: 120, precio: 15000, badge: 'Mas elegido' },
    { imagen: 'assets/serv-kapping.jpg', nombre: 'Kapping', desc: 'Fortalece tus uñas naturales.', duracion: 120, precio: 14000, badge: '' },
    { imagen: 'assets/serv-pies.jpg', nombre: 'Pedi Spa', desc: 'Cuidado y belleza para tus pies.', duracion: 120, precio: 15000, badge: '' },
  ];

  readonly serviciosExtra = [
    { imagen: 'assets/serv-dermaplaning.jpg', nombre: 'Dermaplaning', desc: 'Exfoliacion profunda para una piel luminosa.', duracion: 60, precio: 12000, badge: '' },
    { imagen: 'assets/serv-lifting.jpg', nombre: 'Lifting de pestañas', desc: 'Mirada definida y natural sin extensions.', duracion: 90, precio: 11000, badge: '' },
    { imagen: 'assets/serv-semipermanente.jpg', nombre: 'Semipermanente', desc: 'Color duradero en manos y pies.', duracion: 90, precio: 13000, badge: '' },
  ];

  mostrarTodos = false;
  cursos: Curso[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  mostrarCursos = false;
  busquedaProducto = '';
  categoriaSeleccionada = '';
  categorias: string[] = [];

  readonly galeriaFotos = [
    'assets/galeria1.jpg',
    'assets/galeria2.jpg',
    'assets/galeria3.jpg',
    'assets/galeria4.jpg',
    'assets/galeria5.jpg',
    'assets/galeria6.jpg',
  ];

  private readonly WHATSAPP_NUM = '5493884427062';
  private readonly BASE_SLOTS = [
    { hora: '09:00', minutos: 540 },
    { hora: '10:30', minutos: 630 },
    { hora: '14:30', minutos: 870 },
    { hora: '16:00', minutos: 960 },
    { hora: '18:00', minutos: 1080 },
    { hora: '20:00', minutos: 1200 },
  ];

  constructor(
    private publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.startHeroCarousel();
    this.initNavbarScroll();
    this.publicService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.cdr.detectChanges();
      },
    });
    this.publicService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.categorias = [...new Set(data.map((p) => p.categoria).filter(Boolean))] as string[];
        this.cdr.detectChanges();
      },
    });
    this.publicService.getServicios().subscribe({
      next: (data) => {
        this.serviciosDisponibles = data.map((s) => ({ id: s.id, nombre: s.nombre }));
        if (data.length > 0) {
          this.servicioSeleccionado = data[0].id;
          this.generarSemana();
          this.cargarDisponibilidad();
        }
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initScrollReveal(), 200);
  }

  ngOnDestroy(): void {
    if (this.heroInterval) clearInterval(this.heroInterval);
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
  }

  private initNavbarScroll(): void {
    this.scrollHandler = () => {
      this.navbarVisible = window.scrollY > window.innerHeight * 0.6;
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  filtrarProductos(): void {
    const term = this.busquedaProducto.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter((p) => {
      const matchBusqueda = !term || p.nombre.toLowerCase().includes(term) || (p.descripcion && p.descripcion.toLowerCase().includes(term));
      const matchCategoria = !this.categoriaSeleccionada || p.categoria === this.categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    });
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada = this.categoriaSeleccionada === cat ? '' : cat;
    this.filtrarProductos();
  }

  private initScrollReveal(): void {
    const elements = this.el.nativeElement.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el: Element) => observer.observe(el));
  }

  startHeroCarousel(): void {
    this.heroInterval = setInterval(() => {
      this.heroSlide = (this.heroSlide + 1) % this.heroSlides.length;
      this.cdr.detectChanges();
    }, 5500);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleServicios(): void {
    this.mostrarTodos = !this.mostrarTodos;
  }

  toggleCursos(): void {
    this.mostrarCursos = !this.mostrarCursos;
  }

  cerrarCursos(): void {
    this.mostrarCursos = false;
  }

  reservarWhatsApp(servicioNombre: string): void {
    const msg = encodeURIComponent(
      `Hola! Me gustaria reservar un turno para ${servicioNombre}.`
    );
    window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
  }

  generarSemana(): void {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - ((diaSemana + 6) % 7));
    const nombres = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    this.semana = [];
    for (let i = 0; i < 6; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;
      this.semana.push({
        nombre: nombres[i],
        fecha: fechaStr,
        fechaCorta: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
        horariosLibres: [],
      });
    }
    const hoyStr = this.formatearFechaStr(hoy);
    const idx = this.semana.findIndex((d) => d.fecha === hoyStr);
    this.diaActualIndex = idx >= 0 ? idx : 0;
  }

  onServicioChange(): void {
    this.cargarDisponibilidad();
  }

  get diaActual(): DiaDisponibilidad | undefined {
    return this.semana[this.diaActualIndex];
  }

  get puedeAvanzar(): boolean {
    return this.diaActualIndex < this.semana.length - 1;
  }

  get puedeRetroceder(): boolean {
    return this.diaActualIndex > 0;
  }

  diaSiguiente(): void {
    if (this.puedeAvanzar) {
      this.diaActualIndex++;
    }
  }

  diaAnterior(): void {
    if (this.puedeRetroceder) {
      this.diaActualIndex--;
    }
  }

  esHoy(): boolean {
    if (!this.diaActual) return false;
    const hoy = new Date();
    return this.diaActual.fecha === this.formatearFechaStr(hoy);
  }

  cargarDisponibilidad(): void {
    this.cargando = true;
    this.cdr.detectChanges();
    for (const dia of this.semana) {
      dia.horariosLibres = [];
    }
    const ids = this.servicioSeleccionado ? [this.servicioSeleccionado] : [];
    const hoy = new Date();
    const hoyStr = this.formatearFechaStr(hoy);
    const minutosAhora = hoy.getHours() * 60 + hoy.getMinutes();
    let completadas = 0;
    const total = this.semana.length;
    for (const dia of this.semana) {
      this.publicService.getDisponibilidad(dia.fecha, ids).subscribe({
        next: (libres) => {
          const esHoy = dia.fecha === hoyStr;
          const esPasado = dia.fecha < hoyStr;
          if (esPasado) {
            dia.horariosLibres = [];
          } else if (esHoy) {
            dia.horariosLibres = libres.filter((h) => {
              const [hh, mm] = h.split(':').map(Number);
              return hh * 60 + mm > minutosAhora;
            });
          } else {
            dia.horariosLibres = libres;
          }
          completadas++;
          if (completadas === total) {
            this.cargando = false;
            this.cdr.detectChanges();
          }
        },
        error: () => {
          completadas++;
          if (completadas === total) {
            this.cargando = false;
            this.cdr.detectChanges();
          }
        },
      });
    }
  }

  reservarTurno(hora: string, fecha: string): void {
    const serv = this.serviciosDisponibles.find((s) => s.id === this.servicioSeleccionado);
    const nombreServicio = serv?.nombre || 'Servicio';
    const d = new Date(fecha + 'T12:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const fechaLarga = `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
    const msg = encodeURIComponent(
      `Hola! Me gustaria reservar un turno.\n\nDia: ${fechaLarga}\nHorario: ${hora}\nServicio: ${nombreServicio}\n\nGracias!`
    );
    window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
  }

  formatearFechaLarga(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  formatearFechaStr(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  totalHorariosLibres(): number {
    const dia = this.diaActual;
    return dia ? dia.horariosLibres.length : 0;
  }

  formatoPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(precio);
  }

  duracionLabel(minutos: number): string {
    if (minutos < 60) return `${minutos} min`;
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  formatFechaLanding(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T12:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  formatFechaCorta(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T12:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]}`;
  }
}
