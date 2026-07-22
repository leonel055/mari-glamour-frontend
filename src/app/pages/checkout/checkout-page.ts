import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PedidoService } from '../../services/pedido.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage {
  private cartService = inject(CartService);
  private pedidoService = inject(PedidoService);
  private toast = inject(ToastService);

  items$ = this.cartService.items$;
  subtotal$ = this.cartService.subtotal$;

  buyer = { nombre: '', email: '', telefono: '' };
  procesando = false;

  formatoPrecio(precio: number | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio ?? 0);
  }

  imagenUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/')) return `https://mari-glamour-backend.onrender.com${url}`;
    return url;
  }

  pagarConMercadoPago(): void {
    const items = this.cartService.items;
    if (items.length === 0) {
      this.toast.warning('El carrito esta vacio');
      return;
    }
    if (!this.buyer.nombre.trim()) {
      this.toast.warning('Ingresa tu nombre');
      return;
    }

    this.procesando = true;

    this.pedidoService.createPreference({
      items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      buyer: {
        nombre: this.buyer.nombre.trim(),
        email: this.buyer.email?.trim() || undefined,
        telefono: this.buyer.telefono?.trim() || undefined,
      },
    }).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        window.location.href = res.initPoint;
      },
      error: (err) => {
        this.procesando = false;
        this.toast.error(err.error?.error || 'Error al procesar el pago');
      },
    });
  }
}
