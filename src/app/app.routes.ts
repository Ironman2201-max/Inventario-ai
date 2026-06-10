import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { authGuard } from './guards/auth-guard';
import { GestionUsuarios } from './pages/gestion-usuarios/gestion-usuarios';
import { ContainerRegister } from './modules/containers/container-register/container-register';
import { ContainerList } from './modules/containers/container-list/container-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { expectedRole: 'admin' } // Pasamos el rol requerido en la metadata de la ruta
  },
  { 
    path: 'user-dashboard', 
    component: UserDashboard,
    canActivate: [authGuard],
    data: { expectedRole: 'user' } 
  },
  { 
    path: 'gestion-usuarios', 
    component: GestionUsuarios,
    canActivate: [authGuard],
    data: { expectedRole: 'admin' } 
  },
 { path: 'contenedores/registro', component: ContainerRegister },
      
    { path: 'contenedores/inventario', component: ContainerList },
  // Redirección por defecto si la ruta no existe
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
   
];