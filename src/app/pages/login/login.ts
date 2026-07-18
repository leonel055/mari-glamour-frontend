import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toast.warning('Completa todos los campos');
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.toast.success('Bienvenida!');
        this.router.navigate(['/admin/agenda']);
      },
      error: (err) => {
        this.toast.error(err.error?.error || 'Error al iniciar sesion');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
