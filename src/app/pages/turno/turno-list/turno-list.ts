import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Turno } from '../../../shared/interfaces/turno.interface';
import { TurnoService } from '../../../services/turno.service';
import { ToastService } from '../../../core/services/toast.service';

interface GrupoDia {
  fecha: string;
  label: string;
  esHoy: boolean;
  turnos: Turno[];
}

@Component({
  selector: 'app-turno-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './turno-list.html',
  styleUrl: './turno-list.css',
})
export class TurnoList implements OnInit {
  todosLosTurnos: Turno[] = [];
  grupos: GrupoDia[] = [];
  filtro: 'activos' | 'hoy' | 'semana' | 'todos' = 'activos';

  constructor(
    private turnoService: TurnoService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.turnoService.listar().subscribe({
      next: (data) => {
        this.todosLosTurnos = data;
        this.aplicarFiltro();
        this.cdr.detectChanges();
      },
    });
  }

  setFiltro(f: 'activos' | 'hoy' | 'semana' | 'todos'): void {
    this.filtro = f;
    this.aplicarFiltro();
    this.cdr.detectChanges();
  }

  aplicarFiltro(): void {
    const hoy = new Date();
    const hoyStr = this.formatearFecha(hoy);

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    let filtrados: Turno[];

    switch (this.filtro) {
      case 'hoy':
        filtrados = this.todosLosTurnos.filter((t) => t.fecha === hoyStr);
        break;
      case 'semana':
        filtrados = this.todosLosTurnos.filter((t) => {
          const f = new Date(t.fecha + 'T12:00:00');
          return f >= inicioSemana && f <= finSemana;
        });
        break;
      case 'todos':
        filtrados = [...this.todosLosTurnos];
        break;
      case 'activos':
      default:
        filtrados = this.todosLosTurnos.filter(
          (t) => t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO'
        );
        break;
    }

    filtrados.sort((a, b) => {
      if (a.fecha !== b.fecha) return a.fecha > b.fecha ? 1 : -1;
      return a.horaInicio > b.horaInicio ? 1 : -1;
    });

    this.grupos = this.agruparPorDia(filtrados, hoyStr);
  }

  agruparPorDia(turnos: Turno[], hoyStr: string): GrupoDia[] {
    const map = new Map<string, Turno[]>();
    for (const t of turnos) {
      const arr = map.get(t.fecha) || [];
      arr.push(t);
      map.set(t.fecha, arr);
    }

    const grupos: GrupoDia[] = [];
    for (const [fecha, diaTurnos] of map) {
      grupos.push({
        fecha,
        label: this.labelFecha(fecha, hoyStr),
        esHoy: fecha === hoyStr,
        turnos: diaTurnos,
      });
    }

    return grupos;
  }

  labelFecha(fecha: string, hoyStr: string): string {
    const d = new Date(fecha + 'T12:00:00');
    const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][
      d.getDay()
    ];
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = this.formatearFecha(ayer);

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const mananaStr = this.formatearFecha(manana);

    if (fecha === hoyStr) return 'Hoy';
    if (fecha === ayerStr) return 'Ayer';
    if (fecha === mananaStr) return 'Manana';
    return `${diaSemana} ${d.getDate()} ${meses[d.getMonth()]}`;
  }

  cancelarTurno(turno: Turno): void {
    if (!confirm('Cancelar este turno?')) return;
    this.turnoService.cancelar(turno.id).subscribe({
      next: (res) => {
        if (res.estado === 'CANCELADO') {
          this.toast.success('Turno cancelado - horario disponible');
        } else {
          this.toast.info('Turno finalizado (ya paso la hora)');
        }
        this.cargar();
      },
      error: () => {
        this.toast.error('Error al cancelar turno');
      },
    });
  }

  formatearHora(hora: string): string {
    const p = hora.split(':');
    return `${p[0]}:${p[1]}`;
  }

  formatearFecha(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  claseEstado(estado: string): string {
    return `badge badge-${estado.toLowerCase()}`;
  }

  getServicios(turno: Turno): string {
    const nombres = [turno.Servicio?.nombre];
    if (turno.ServiciosExtra && turno.ServiciosExtra.length > 0) {
      nombres.push(...turno.ServiciosExtra.map((s) => s.nombre));
    }
    return nombres.filter(Boolean).join(' + ');
  }

  contarActivos(): number {
    return this.todosLosTurnos.filter(
      (t) => t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO'
    ).length;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  }
}
