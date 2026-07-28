import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Obtenemos el usuario autenticado desde el Signal
  const usuarioActual = authService.currentUser();

  if (!usuarioActual) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtener los roles permitidos desde los datos de la ruta (soporta string o string[])
  const rolesPermitidos: string | string[] = route.data['expectedRole'];

  if (rolesPermitidos) {
    const rolUsuario = (usuarioActual.rol || '').toLowerCase().trim();
    
    // Normalizar a arreglo
    const listaRoles = Array.isArray(rolesPermitidos)
      ? rolesPermitidos.map(r => r.toLowerCase().trim())
      : [rolesPermitidos.toLowerCase().trim()];

    // 3. Validar si el rol del usuario está dentro de los permitidos
    if (!listaRoles.includes(rolUsuario)) {
      alert('Acceso Denegado: No tienes permisos suficientes para ingresar a esta sección.');

      // Redirección inteligente al panel correspondiente según su rol
      if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
        router.navigate(['/admin-dashboard']);
      } else {
        router.navigate(['/user-dashboard']);
      }
      return false;
    }
  }

  // Si está autenticado y tiene el rol permitido, pasa la ruta
  return true;
};