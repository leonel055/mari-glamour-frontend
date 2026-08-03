import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../services/public.service';
import { Servicio } from '../../shared/interfaces/servicio.interface';

interface DiaReserva {
  fecha: string;
  nombre: string;
  diaNum: number;
  mes: string;
}

@Component({
  selector: 'app-reserva-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-page.html',
  styleUrl: './reserva-page.css',
})
export class ReservaPage implements OnInit {
  private publicService = inject(PublicService);
  private cdr = inject(ChangeDetectorRef);

  servicios: Servicio[] = [];
  seleccionados: string[] = [];
  dias: DiaReserva[] = [];
  fechaSeleccionada = '';
  horarios: string[] = [];
  horaSeleccionada = '';
  clienteNombre = '';
  clienteWhatsApp = '';
  clienteEmail = '';
  observaciones = '';
  paso = 1;
  cargandoServicios = true;
  cargandoHorarios = false;
  procesando = false;
  error = '';

  ngOnInit(): void {
    this.publicService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargandoServicios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoServicios = false;
        this.error = 'No se pudieron cargar los servicios. Recargá la pagina.';
        this.cdr.detectChanges();
      },
    });
    this.generarDias();
    this.cdr.detectChanges();
  }

  private generarDias(): void {
    const hoy = new Date();
    const nombres = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.dias = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      if (d.getDay() === 0) continue;
      this.dias.push({
        fecha: this.formatearFecha(d),
        nombre: i === 0 ? 'Hoy' : nombres[d.getDay()],
        diaNum: d.getDate(),
        mes: meses[d.getMonth()],
      });
    }
    if (this.dias.length > 0) {
      this.fechaSeleccionada = this.dias[0].fecha;
    }
  }

  private formatearFecha(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get totalServicios(): number {
    return this.servicios
      .filter((s) => this.seleccionados.includes(s.id))
      .reduce((sum, s) => sum + Number(s.precio || 0), 0);
  }

  get montoSenia(): number {
    return Math.round(this.totalServicios * 0.5);
  }

  get duracionTotal(): number {
    return this.servicios
      .filter((s) => this.seleccionados.includes(s.id))
      .reduce((sum, s) => sum + Number(s.duracion || 0), 0);
  }

  toggleServicio(id: string): void {
    const idx = this.seleccionados.indexOf(id);
    if (idx >= 0) {
      this.seleccionados.splice(idx, 1);
    } else {
      this.seleccionados.push(id);
    }
    this.horaSeleccionada = '';
    this.horarios = [];
    this.cdr.detectChanges();
  }

  esServicioSeleccionado(id: string): boolean {
    return this.seleccionados.includes(id);
  }

  puedeAvanzarPaso1(): boolean {
    return this.seleccionados.length > 0;
  }

  puedeAvanzarPaso2(): boolean {
    return !!this.horaSeleccionada;
  }

  puedeAvanzarPaso3(): boolean {
    return this.clienteNombre.trim().length > 0;
  }

  irPaso1(): void {
    this.paso = 1;
  }

  irPaso2(): void {
    this.paso = 2;
  }

  irPaso3(): void {
    this.paso = 3;
  }

  irPaso4(): void {
    this.paso = 4;
  }

  seleccionarDia(fecha: string): void {
    this.fechaSeleccionada = fecha;
    this.horaSeleccionada = '';
    this.cargarHorarios();
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada = hora;
  }

  cargarHorarios(): void {
    if (this.seleccionados.length === 0) return;
    this.cargandoHorarios = true;
    this.cdr.detectChanges();
    this.publicService.getDisponibilidad(this.fechaSeleccionada, this.seleccionados).subscribe({
      next: (horarios) => {
        const hoy = new Date();
        const hoyStr = this.formatearFecha(hoy);
        const minutosAhora = hoy.getHours() * 60 + hoy.getMinutes();
        this.horarios = horarios.filter((h) => {
          if (this.fechaSeleccionada !== hoyStr) return true;
          const [hh, mm] = h.split(':').map(Number);
          return hh * 60 + mm > minutosAhora;
        });
        this.cargandoHorarios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoHorarios = false;
        this.horarios = [];
        this.cdr.detectChanges();
      },
    });
  }

  confirmar(): void {
    if (!this.clienteNombre.trim()) {
      this.error = 'Ingresa tu nombre';
      return;
    }
    if (!this.horaSeleccionada) {
      this.error = 'Selecciona un horario';
      return;
    }
    this.error = '';
    this.procesando = true;

    this.publicService.crearReserva({
      servicioIds: this.seleccionados,
      fecha: this.fechaSeleccionada,
      horaInicio: this.horaSeleccionada,
      clienteNombre: this.clienteNombre.trim(),
      clienteWhatsApp: this.clienteWhatsApp?.trim() || undefined,
      clienteEmail: this.clienteEmail?.trim() || undefined,
      observaciones: this.observaciones?.trim() || undefined,
    }).subscribe({
      next: (res) => {
        localStorage.setItem('ultimaReserva', JSON.stringify({
          id: res.turnoId,
          clienteNombre: this.clienteNombre.trim(),
          fecha: this.fechaSeleccionada,
          horaInicio: this.horaSeleccionada,
          montoSenia: res.montoSenia,
        }));
        window.location.href = res.initPoint;
      },
      error: (err) => {
        this.procesando = false;
        this.error = err.error?.error || 'Error al crear la reserva. Intenta de nuevo.';
      },
    });
  }

  formatoPrecio(precio: number | string | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(precio ?? 0));
  }

  duracionLabel(minutos: number): string {
    if (minutos < 60) return `${minutos} min`;
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  formatearHora(hora: string): string {
    return hora.slice(0, 5);
  }

  formatearFechaLarga(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
  }
}
