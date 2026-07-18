import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turno } from '../../shared/interfaces/turno.interface';
import { TurnoService } from '../../services/turno.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {
  turnos: Turno[] = [];
  fechaSeleccionada: string = '';
  dias: { label: string; fecha: string; diaNum: number; diaSemana: string; esHoy: boolean }[] = [];
  offsetSemana = 0;

  constructor(private turnoService: TurnoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generarSemana();
    this.seleccionarHoy();
  }

  generarSemana(): void {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - ((diaSemana + 6) % 7) + this.offsetSemana * 7);

    const nombres = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    this.dias = [];

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;

      const esHoy = this.esMismaFecha(fecha, new Date());

      this.dias.push({
        label: nombres[i],
        fecha: fechaStr,
        diaNum: fecha.getDate(),
        diaSemana: nombres[i],
        esHoy,
      });
    }
  }

  seleccionarHoy(): void {
    this.offsetSemana = 0;
    this.generarSemana();
    const hoy = new Date();
    this.fechaSeleccionada = this.formatearFecha(hoy);
    this.cargarTurnos();
  }

  semanaAnterior(): void {
    this.offsetSemana--;
    this.generarSemana();
    this.cargarTurnos();
  }

  semanaSiguiente(): void {
    this.offsetSemana++;
    this.generarSemana();
    this.cargarTurnos();
  }

  seleccionarDia(fecha: string): void {
    this.fechaSeleccionada = fecha;
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.turnoService.listar().subscribe({
      next: (turnos) => {
        this.turnos = turnos.filter(
          (t) => t.fecha === this.fechaSeleccionada && t.estado !== 'CANCELADO'
        );
        this.cdr.detectChanges();
      },
    });
  }

  formatearFecha(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  esMismaFecha(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  claseEstado(estado: string): string {
    return `badge badge-${estado.toLowerCase()}`;
  }

  formatearHora(hora: string): string {
    const partes = hora.split(':');
    return `${partes[0]}:${partes[1]}`;
  }

  getServicios(turno: Turno): string {
    const nombres = [turno.Servicio?.nombre];
    if (turno.ServiciosExtra) {
      nombres.push(...turno.ServiciosExtra.map((s) => s.nombre));
    }
    return nombres.filter(Boolean).join(' + ');
  }

  get labelSemana(): string {
    if (this.dias.length === 0) return '';
    const primera = this.dias[0];
    const ultima = this.dias[this.dias.length - 1];
    return `${primera.diaNum} - ${ultima.diaNum}`;
  }
}
