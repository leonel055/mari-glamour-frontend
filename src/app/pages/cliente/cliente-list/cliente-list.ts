import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { ClienteService } from '../../../services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarCliente(cliente: Cliente, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Eliminar cliente "${cliente.nombre}"?`)) return;
    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => {
        this.toast.success('Cliente eliminado');
        this.cargar();
      },
      error: () => {
        this.toast.error('Error al eliminar cliente');
      },
    });
  }
}
