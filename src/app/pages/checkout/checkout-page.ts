import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage {
  private cartService = inject(CartService);

  items$ = this.cartService.items$;
  subtotal$ = this.cartService.subtotal$;

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
}
