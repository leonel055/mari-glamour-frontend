import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../../shared/interfaces/servicio.interface';
import { ServicioService } from '../../../services/servicio.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css',
})
export class ServicioForm implements OnInit {
  servicio: Partial<Servicio> = { nombre: '', precio: 0, duracion: 90, activo: true };
  esEdicion = false;
  id = '';

  constructor(
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.servicioService.listar().subscribe((servicios) => {
        const encontrado = servicios.find((s) => s.id === this.id);
        if (encontrado) this.servicio = encontrado;
        this.cdr.detectChanges();
      });
    }
  }

  onSubmit(): void {
    if (!this.servicio.nombre) {
      this.toast.warning('Completa el nombre del servicio');
      return;
    }
    const obs = this.esEdicion
      ? this.servicioService.editar(this.id, this.servicio)
      : this.servicioService.crear(this.servicio);
    obs.subscribe({
      next: () => {
        this.toast.success(this.esEdicion ? 'Servicio actualizado' : 'Servicio creado');
        this.router.navigate(['/admin/servicios']);
      },
      error: () => {
        this.toast.error('Error al guardar servicio');
      },
    });
  }
}
