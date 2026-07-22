import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productoId: string;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = new BehaviorSubject<CartItem[]>([]);
  items$ = this.items.asObservable();

  get count(): number {
    return this.items.value.reduce((sum, i) => sum + i.cantidad, 0);
  }
}
