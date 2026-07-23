import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PedidoService, Pedido } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido-result.html',
  styleUrl: './pedido-result.css',
})
export class PedidoResult implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  resultado: 'exito' | 'fracaso' | 'pendiente' = 'exito';
  pedido: Pedido | null = null;

  ngOnInit(): void {
    const segment = this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path || 'exito';
    this.resultado = segment as any;
    const pedidoId = this.route.snapshot.paramMap.get('id') || '';

    if (!pedidoId) return;

    const stored = localStorage.getItem('ultimoPedido');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.id === pedidoId) {
          this.pedido = parsed as Pedido;
          this.cdr.detectChanges();
        }
      } catch (_) {}
    }

    this.pedidoService.obtenerPedido(pedidoId).subscribe({
      next: (data) => {
        this.pedido = data;
        localStorage.removeItem('ultimoPedido');
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  ngOnDestroy(): void {}

  formatoPrecio(precio: number | string | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(precio ?? 0));
  }
}
