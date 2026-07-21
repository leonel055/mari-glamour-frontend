import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Curso } from '../../../shared/interfaces/curso.interface';
import { CursoService } from '../../../services/curso.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css',
})
export class CursoForm implements OnInit {
  curso: Partial<Curso> = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    horario: '',
    duracion: 0,
    precio: 0,
    cupos: 0,
    cuposDisponibles: 0,
    inscripcion: 0,
    temario: [],
    incluye: [],
    activo: true,
  };
  esEdicion = false;
  id = '';
  nuevoItemIncluye = '';

  constructor(
    private cursoService: CursoService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.cursoService.listar().subscribe((cursos) => {
        const encontrado = cursos.find((c) => c.id === this.id);
        if (encontrado) {
          this.curso = encontrado;
          if (!this.curso.temario) this.curso.temario = [];
          if (!this.curso.incluye) this.curso.incluye = [];
        }
        this.cdr.detectChanges();
      });
    }
  }

  agregarModulo(): void {
    if (!this.curso.temario) this.curso.temario = [];
    this.curso.temario.push({ titulo: '', items: [''] });
    this.cdr.detectChanges();
  }

  eliminarModulo(index: number): void {
    this.curso.temario!.splice(index, 1);
    this.cdr.detectChanges();
  }

  agregarItem(moduloIndex: number): void {
    this.curso.temario![moduloIndex].items.push('');
    this.cdr.detectChanges();
  }

  eliminarItem(moduloIndex: number, itemIndex: number): void {
    this.curso.temario![moduloIndex].items.splice(itemIndex, 1);
    this.cdr.detectChanges();
  }

  agregarIncluye(): void {
    if (this.nuevoItemIncluye.trim()) {
      if (!this.curso.incluye) this.curso.incluye = [];
      this.curso.incluye.push(this.nuevoItemIncluye.trim());
      this.nuevoItemIncluye = '';
      this.cdr.detectChanges();
    }
  }

  eliminarIncluye(index: number): void {
    this.curso.incluye!.splice(index, 1);
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (!this.curso.nombre) {
      this.toast.warning('Completa el nombre del curso');
      return;
    }
    if (!this.curso.fechaInicio) {
      this.toast.warning('Selecciona la fecha de inicio');
      return;
    }
    if (!this.curso.precio) {
      this.toast.warning('Ingresa el precio del curso');
      return;
    }
    if (!this.curso.cupos) {
      this.toast.warning('Ingresa la cantidad de cupos');
      return;
    }
    if (this.curso.cuposDisponibles === undefined || this.curso.cuposDisponibles === null) {
      this.curso.cuposDisponibles = this.curso.cupos;
    }
    const obs = this.esEdicion
      ? this.cursoService.editar(this.id, this.curso)
      : this.cursoService.crear(this.curso);
    obs.subscribe({
      next: () => {
        this.toast.success(this.esEdicion ? 'Curso actualizado' : 'Curso creado');
        this.router.navigate(['/admin/cursos']);
      },
      error: () => {
        this.toast.error('Error al guardar curso');
      },
    });
  }
}
