import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { ClienteService } from '../../../services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  cliente: Partial<Cliente> = { nombre: '', telefono: '', email: '' };
  esEdicion = false;
  id = '';

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.clienteService.listar().subscribe((clientes) => {
        const encontrado = clientes.find((c) => c.id === this.id);
        if (encontrado) this.cliente = encontrado;
        this.cdr.detectChanges();
      });
    }
  }

  onSubmit(): void {
    if (!this.cliente.nombre) {
      this.toast.warning('Completa el nombre del cliente');
      return;
    }
    const obs = this.esEdicion
      ? this.clienteService.editar(this.id, this.cliente)
      : this.clienteService.crear(this.cliente);
    obs.subscribe({
      next: () => {
        this.toast.success(this.esEdicion ? 'Cliente actualizado' : 'Cliente creado');
        this.router.navigate(['/admin/clientes']);
      },
      error: () => {
        this.toast.error('Error al guardar cliente');
      },
    });
  }
}
