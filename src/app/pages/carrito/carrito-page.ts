import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-page.html',
  styleUrl: './carrito-page.css',
})
export class CarritoPage {
  private cartService = inject(CartService);

  items$ = this.cartService.items$;
  count$ = this.cartService.count$;
  subtotal$ = this.cartService.subtotal$;

  imagenUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/')) return `https://mari-glamour-backend.onrender.com${url}`;
    return url;
  }

  formatoPrecio(precio: number | null): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio ?? 0);
  }

  updateCantidad(item: CartItem, delta: number): void {
    this.cartService.updateCantidad(item.productoId, item.cantidad + delta);
  }

  removeItem(productoId: string): void {
    this.cartService.removeFromCart(productoId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
