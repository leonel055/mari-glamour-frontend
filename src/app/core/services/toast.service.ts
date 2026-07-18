import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const id = ++this.counter;
    const toast: Toast = { id, message, type, visible: true };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 3500): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number): void {
    const updated = this.toastsSubject.value.map((t) =>
      t.id === id ? { ...t, visible: false } : t
    );
    this.toastsSubject.next(updated);
    setTimeout(() => {
      this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
    }, 300);
  }
}
