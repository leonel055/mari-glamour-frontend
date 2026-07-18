import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../../services/turno.service';
import { ClienteService } from '../../../services/cliente.service';
import { ServicioService } from '../../../services/servicio.service';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { Servicio } from '../../../shared/interfaces/servicio.interface';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './turno-form.html',
  styleUrl: './turno-form.css',
})
export class TurnoForm implements OnInit {
  clienteId = '';
  servicioIds: string[] = [];
  costoAdicional = 0;
  fecha = '';
  horaInicio = '';
  clientes: Cliente[] = [];
  servicios: Servicio[] = [];
  horarios: string[] = [];
  error = '';
  duracionTotal = 0;
  precioTotal = 0;
  fechaMinima = '';

  constructor(
    private turnoService: TurnoService,
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.clienteService.listar().subscribe((d) => {
      this.clientes = d;
      this.cdr.detectChanges();
    });
    this.servicioService.listar().subscribe((d) => {
      this.servicios = d;
      this.cdr.detectChanges();
    });
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    this.fecha = `${yyyy}-${mm}-${dd}`;
    this.fechaMinima = this.fecha;
  }

  toggleServicio(servicioId: string): void {
    const idx = this.servicioIds.indexOf(servicioId);
    if (idx > -1) {
      this.servicioIds.splice(idx, 1);
    } else {
      this.servicioIds.push(servicioId);
    }
    this.calcularTotales();
    this.cargarHorarios();
  }

  isSelected(servicioId: string): boolean {
    return this.servicioIds.includes(servicioId);
  }

  calcularTotales(): void {
    this.duracionTotal = 0;
    this.precioTotal = 0;
    for (const id of this.servicioIds) {
      const s = this.servicios.find((sv) => sv.id === id);
      if (s) {
        this.duracionTotal += Number(s.duracion) || 90;
        this.precioTotal += Number(s.precio) || 0;
      }
    }
  }

  cargarHorarios(): void {
    if (this.servicioIds.length === 0) {
      this.horarios = [];
      this.horaInicio = '';
      return;
    }
    this.turnoService.disponibles(this.fecha, this.servicioIds).subscribe({
      next: (h) => {
        this.horarios = h;
        this.horaInicio = '';
        this.filtrarHorariosPasados();
        this.cdr.detectChanges();
      },
    });
  }

  onFechaCambia(): void {
    this.cargarHorarios();
  }

  filtrarHorariosPasados(): void {
    if (this.fecha !== this.fechaMinima) return;
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const slots = [
      { hora: '09:00', minutos: 540 },
      { hora: '10:30', minutos: 630 },
      { hora: '14:30', minutos: 870 },
      { hora: '16:00', minutos: 960 },
      { hora: '18:00', minutos: 1080 },
      { hora: '20:00', minutos: 1200 },
    ];
    this.horarios = this.horarios.filter((h) => {
      const slot = slots.find((s) => s.hora === h);
      return slot ? slot.minutos > minutosAhora : true;
    });
  }

  esFechaPasada(): boolean {
    return this.fecha < this.fechaMinima;
  }

  onSubmit(): void {
    if (!this.clienteId || this.servicioIds.length === 0 || !this.fecha || !this.horaInicio) {
      this.toast.warning('Completa todos los campos');
      return;
    }
    if (this.esFechaPasada()) {
      this.toast.error('No se pueden crear turnos en fechas pasadas');
      return;
    }
    if (this.fecha === this.fechaMinima) {
      const ahora = new Date();
      const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
      const [h, m] = this.horaInicio.split(':').map(Number);
      const minutosSeleccion = h * 60 + m;
      if (minutosSeleccion <= minutosAhora) {
        this.toast.error('No se pueden crear turnos en horarios pasados');
        return;
      }
    }
    this.error = '';
    this.turnoService
      .crear({
        clienteId: this.clienteId,
        servicioIds: this.servicioIds,
        fecha: this.fecha,
        horaInicio: this.horaInicio,
        costoAdicional: this.costoAdicional || 0,
      })
      .subscribe({
        next: () => {
          this.toast.success('Turno creado correctamente');
          this.router.navigate(['/admin/turnos']);
        },
        error: (e) => {
          this.toast.error(e.error?.error || 'Error al crear turno');
        },
      });
  }

  formatearDuracion(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  }
}
