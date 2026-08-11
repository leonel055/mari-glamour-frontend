import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-reserva-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reserva-result.html',
  styleUrl: './reserva-result.css',
})
export class ReservaResult implements OnInit {
  private route = inject(ActivatedRoute);
  private publicService = inject(PublicService);
  private cdr = inject(ChangeDetectorRef);

  resultado: 'exito' | 'fracaso' | 'pendiente' = 'exito';
  reserva: any = null;

  ngOnInit(): void {
    const segment = this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path || 'exito';
    this.resultado = segment as any;
    const reservaId = this.route.snapshot.paramMap.get('id') || '';

    if (!reservaId) return;

    const stored = localStorage.getItem('ultimaReserva');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.id === reservaId) {
          this.reserva = parsed;
          this.cdr.detectChanges();
        }
      } catch (_) {}
    }

    this.publicService.obtenerReserva(reservaId).subscribe({
      next: (data) => {
        this.reserva = data;
        localStorage.removeItem('ultimaReserva');
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  get serviciosNombres(): string {
    if (!this.reserva) return '';
    const servicios = this.reserva.servicios;
    if (Array.isArray(servicios) && servicios.length > 0) {
      const nombres = servicios.map((s) =>
        typeof s === 'string' ? s : s?.nombre
      );
      return nombres.filter(Boolean).join(' + ');
    }
    const principal = this.reserva.Servicio?.nombre;
    const extra = this.reserva.servicioIds?.length > 1 ? ' + servicios' : '';
    return principal ? principal + extra : (this.reserva.servicioIds?.length || 0) + ' servicios';
  }

  formatearHora(hora: string): string {
    return (hora || '').slice(0, 5);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T12:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
  }

  formatoPrecio(precio: number | string | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(precio ?? 0));
  }
}
