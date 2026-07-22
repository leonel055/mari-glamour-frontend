import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../shared/interfaces/producto.interface';

export interface CartItem {
  productoId: string;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
  marca?: string;
  stock: number;
}

const STORAGE_KEY = 'mari_glamour_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  count$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.cantidad, 0))
  );

  subtotal$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0))
  );

  constructor() {
    this.loadFromStorage();
  }

  get count(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.cantidad, 0);
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(producto: Producto, cantidad = 1): void {
    const items = this.itemsSubject.value;
    const existente = items.find((i) => i.productoId === producto.id);

    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock);
    } else {
      items.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: Math.min(cantidad, producto.stock),
        marca: producto.marca,
        stock: producto.stock,
      });
    }

    this.itemsSubject.next([...items]);
    this.saveToStorage();
  }

  removeFromCart(productoId: string): void {
    const items = this.itemsSubject.value.filter((i) => i.productoId !== productoId);
    this.itemsSubject.next(items);
    this.saveToStorage();
  }

  updateCantidad(productoId: string, cantidad: number): void {
    if (cantidad < 1) {
      this.removeFromCart(productoId);
      return;
    }
    const items = this.itemsSubject.value.map((i) =>
      i.productoId === productoId ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i
    );
    this.itemsSubject.next(items);
    this.saveToStorage();
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveToStorage();
  }

  getItem(productoId: string): CartItem | undefined {
    return this.itemsSubject.value.find((i) => i.productoId === productoId);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSubject.value));
    } catch {}
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items: CartItem[] = JSON.parse(raw);
        this.itemsSubject.next(items);
      }
    } catch {}
  }
}
