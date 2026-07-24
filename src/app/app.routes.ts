import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { authGuard } from './guards/auth-guard';
import { GestionUsuarios } from './pages/gestion-usuarios/gestion-usuarios';
import { ContainerRegister } from './modules/containers/container-register/container-register';
import { ContainerList } from './modules/containers/container-list/container-list';
import { ContainerExit } from './modules/containers/container-exit/container-exit';
import { ContainerHistory } from './modules/containers/container-history/container-history';


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
    path: 'facturacion',
    loadComponent: () => import('./modules/billing/invoice-form/invoice-form').then(m => m.InvoiceForm)
  }, 
  { 
    path: 'gestion-usuarios', 
    component: GestionUsuarios,
    canActivate: [authGuard],
    data: { expectedRole: 'admin' } 
  },
 { path: 'contenedores/registro', component: ContainerRegister },
 { path: 'contenedores/salida', component: ContainerExit },
  { path: 'contenedores/inventario', component: ContainerList },
 { path: 'contenedores/historial', component: ContainerHistory },

 // En app.routes.ts:
{
  path: 'facturacion-historial',
  loadComponent: () => import('./modules/billing/invoice-history/invoice-history').then(m => m.InvoiceHistory)
},
     
  // Redirección por defecto si la ruta no existe
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
   
];
