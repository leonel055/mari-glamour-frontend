import { Component, OnInit, inject, OnDestroy } from '@angular/core';
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

  resultado: 'exito' | 'fracaso' | 'pendiente' = 'exito';
  pedido: Pedido | null = null;
  cargando = true;
  private timeoutId: any;

  ngOnInit(): void {
    const segment = this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path || 'exito';
    this.resultado = segment as any;
    const pedidoId = this.route.snapshot.paramMap.get('id') || '';
    const collectionId = this.route.snapshot.queryParamMap.get('collection_id');
    const collectionStatus = this.route.snapshot.queryParamMap.get('collection_status');

    if (!pedidoId) {
      this.cargando = false;
      return;
    }

    this.timeoutId = setTimeout(() => this.cargando = false, 5000);

    if (collectionId && collectionStatus === 'approved') {
      this.pedidoService.confirmarPago(pedidoId, collectionId).subscribe({
        next: () => this.cargarPedido(pedidoId),
        error: () => this.cargarPedido(pedidoId),
      });
    } else {
      this.cargarPedido(pedidoId);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private cargarPedido(id: string): void {
    this.pedidoService.obtenerPedido(id).subscribe({
      next: (data) => {
        this.pedido = data;
        this.cargando = false;
        if (this.timeoutId) clearTimeout(this.timeoutId);
      },
      error: () => {
        this.cargando = false;
        if (this.timeoutId) clearTimeout(this.timeoutId);
      },
    });
  }

  formatoPrecio(precio: number | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio ?? 0);
  }
}
