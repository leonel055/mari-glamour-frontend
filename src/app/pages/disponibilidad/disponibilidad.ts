import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../shared/interfaces/turno.interface';

interface DiaSemana {
  nombre: string;
  fecha: string;
  horariosLibres: string[];
  horariosOcupados: string[];
}

@Component({
  selector: 'app-disponibilidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class Disponibilidad implements OnInit {
  @ViewChild('imagenPlantilla') imagenPlantilla!: ElementRef;

  semana: DiaSemana[] = [];
  cargando = false;
  generando = false;
  semanaInicio = '';
  semanaFin = '';

  private readonly BASE_SLOTS = [
    { hora: '09:00', minutos: 540 },
    { hora: '10:30', minutos: 630 },
    { hora: '14:30', minutos: 870 },
    { hora: '16:00', minutos: 960 },
    { hora: '18:00', minutos: 1080 },
    { hora: '20:00', minutos: 1200 },
  ];

  readonly baseSlots = this.BASE_SLOTS.map((s) => s.hora);

  constructor(
    private turnoService: TurnoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generarSemana();
    this.cargarDisponibilidad();
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
      this.semana.push({
        nombre: nombres[i],
        fecha: `${yyyy}-${mm}-${dd}`,
        horariosLibres: [],
        horariosOcupados: [],
      });
    }

    if (this.semana.length > 0) {
      this.semanaInicio = this.formatearFechaLarga(this.semana[0].fecha);
      this.semanaFin = this.formatearFechaLarga(this.semana[this.semana.length - 1].fecha);
    }
  }

  cargarDisponibilidad(): void {
    this.cargando = true;
    this.turnoService.listar().subscribe({
      next: (turnos) => {
        const hoy = new Date();
        const hoyStr = this.formatearFechaStr(hoy);
        const minutosAhora = hoy.getHours() * 60 + hoy.getMinutes();

        for (const dia of this.semana) {
          const esHoy = dia.fecha === hoyStr;
          const esPasado = dia.fecha < hoyStr;

          const turnosDelDia = turnos.filter(
            (t) => t.fecha === dia.fecha && t.estado !== 'CANCELADO'
          );

          const ocupados = new Set<string>();
          for (const turno of turnosDelDia) {
            const bloques = this.bloquesDelTurno(turno.horaInicio, turno.horaFin);
            bloques.forEach((b) => ocupados.add(b));
          }

          if (esPasado) {
            for (const slot of this.BASE_SLOTS) {
              ocupados.add(slot.hora);
            }
          } else if (esHoy) {
            for (const slot of this.BASE_SLOTS) {
              if (slot.minutos <= minutosAhora) {
                ocupados.add(slot.hora);
              }
            }
          }

          dia.horariosLibres = this.baseSlots.filter((h) => !ocupados.has(h));
          dia.horariosOcupados = this.baseSlots.filter((h) => ocupados.has(h));
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private formatearFechaStr(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private bloquesDelTurno(inicio: string, fin: string): string[] {
    const [hI, mI] = inicio.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);
    const turnoInicio = hI * 60 + mI;
    const turnoFin = hF * 60 + mF;
    const ocupados: string[] = [];
    for (const slot of this.BASE_SLOTS) {
      if (slot.minutos >= turnoInicio && slot.minutos < turnoFin) {
        ocupados.push(slot.hora);
      }
    }
    return ocupados;
  }

  formatearFechaCorta(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  formatearFechaLarga(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  totalHorariosLibres(): number {
    return this.semana.reduce((sum, d) => sum + d.horariosLibres.length, 0);
  }

  async descargarImagen(): Promise<void> {
    if (!this.imagenPlantilla) return;
    this.generando = true;
    this.cdr.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const elemento = this.imagenPlantilla.nativeElement;

      const canvas = await html2canvas(elemento, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        width: 1080,
        height: 1920,
      });

      const link = document.createElement('a');
      link.download = `MariGlamour_Disponibilidad_${this.semana[0].fecha}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al generar la imagen de disponibilidad:', error);
    } finally {
      this.generando = false;
      this.cdr.detectChanges();
    }
  }
}
