import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of (toastService.toasts$ | async); track toast.id) {
        <div class="toast-item" [class]="'toast-' + toast.type" [class.toast-hide]="!toast.visible"
             (click)="toastService.dismiss(toast.id)">
          <i class="bi" [ngClass]="{
            'bi-check-circle-fill': toast.type === 'success',
            'bi-x-circle-fill': toast.type === 'error',
            'bi-info-circle-fill': toast.type === 'info',
            'bi-exclamation-triangle-fill': toast.type === 'warning'
          }"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <i class="bi bi-x toast-close"></i>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: calc(var(--header-height) + 10px);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 90%;
      max-width: 380px;
      pointer-events: none;
    }

    .toast-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      animation: slideIn 0.3s ease;
      pointer-events: auto;
      cursor: pointer;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .toast-hide {
      opacity: 0;
      transform: translateY(-10px);
    }

    .toast-item i:first-child {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
    }

    .toast-close {
      font-size: 0.9rem;
      opacity: 0.5;
      flex-shrink: 0;
    }

    .toast-success {
      background: #E8F5E9;
      color: #2E7D32;
      border: 1px solid #C8E6C9;
    }

    .toast-error {
      background: #FFEBEE;
      color: #C62828;
      border: 1px solid #FFCDD2;
    }

    .toast-info {
      background: #E3F2FD;
      color: #1565C0;
      border: 1px solid #BBDEFB;
    }

    .toast-warning {
      background: #FFF8E1;
      color: #E65100;
      border: 1px solid #FFECB3;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
