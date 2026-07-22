import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
})
export class PublicLayoutComponent {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  cartCount$ = this.cartService.count$;
  toasts$ = this.toastService.toasts$;
}
