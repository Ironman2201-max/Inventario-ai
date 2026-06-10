import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtenemos el usuario actual desde el Signal del servicio
  const usuarioActual = authService.currentUser();

  // 1. Si no está logueado, redirigir al login
  if (!usuarioActual) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtener el rol requerido para esta ruta específica desde la metadata (app.routes.ts)
  const rolRequerido = route.data['expectedRole'];

  // 3. Verificar si el rol del usuario coincide con el requerido
  if (rolRequerido && usuarioActual.rol !== rolRequerido) {
    // Si el rol no coincide, lo redirigimos a su panel correcto para evitar que quede atrapado
    if (usuarioActual.rol === 'admin') {
      router.navigate(['/admin-dashboard']);
    } else {
      router.navigate(['/user-dashboard']);
    }
    return false;
  }

  // Si pasa todas las validaciones, se le permite el acceso a la ruta
  return true;
};