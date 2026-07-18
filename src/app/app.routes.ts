import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { PublicLayoutComponent } from './core/layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing) },
    ],
  },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      { path: 'agenda', loadComponent: () => import('./pages/agenda/agenda').then((m) => m.Agenda) },
      { path: 'clientes', loadComponent: () => import('./pages/cliente/cliente-list/cliente-list').then((m) => m.ClienteList) },
      { path: 'clientes/nuevo', loadComponent: () => import('./pages/cliente/cliente-form/cliente-form').then((m) => m.ClienteForm) },
      { path: 'clientes/editar/:id', loadComponent: () => import('./pages/cliente/cliente-form/cliente-form').then((m) => m.ClienteForm) },
      { path: 'servicios', loadComponent: () => import('./pages/servicio/servicio-list/servicio-list').then((m) => m.ServicioList) },
      { path: 'servicios/nuevo', loadComponent: () => import('./pages/servicio/servicio-form/servicio-form').then((m) => m.ServicioForm) },
      { path: 'servicios/editar/:id', loadComponent: () => import('./pages/servicio/servicio-form/servicio-form').then((m) => m.ServicioForm) },
      { path: 'turnos', loadComponent: () => import('./pages/turno/turno-list/turno-list').then((m) => m.TurnoList) },
      { path: 'turnos/nuevo', loadComponent: () => import('./pages/turno/turno-form/turno-form').then((m) => m.TurnoForm) },
      { path: 'disponibilidad', loadComponent: () => import('./pages/disponibilidad/disponibilidad').then((m) => m.Disponibilidad) },
    ],
  },
  { path: '**', redirectTo: '' },
];
