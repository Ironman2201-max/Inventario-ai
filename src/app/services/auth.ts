import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


// Definimos la estructura de la respuesta del usuario
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'user';
}

interface LoginResponse {
  message: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL de tu backend en XAMPP
  private apiUrl = 'https://162-35-169-164.sslip.io/api';

  // WritableSignal para almacenar el estado del usuario (null si no está logueado)
  private currentUserSignal = signal<Usuario | null>(null);

  // Signal computado (de solo lectura) para que los componentes lean el usuario actual
  public currentUser = computed(() => this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {
    // Al inicializar el servicio, verificamos si hay una sesión guardada
    const session = localStorage.getItem('user_session');
    if (session) {
      this.currentUserSignal.set(JSON.parse(session));
    }
  }

  // Método para registrar un usuario
  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro.php`, usuario);
  }

  // Método para iniciar sesión
  login(credenciales: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login.php`, credenciales).pipe(
      tap(response => {
        if (response && response.usuario) {
          // Guardamos en localStorage para persistencia
          localStorage.setItem('user_session', JSON.stringify(response.usuario));
          // Actualizamos nuestro Signal reactivo
          this.currentUserSignal.set(response.usuario);
        }
      })
    );
  }

   
//métodos para gestión de usuarios (solo para admin)
obtenerTodosLosUsuarios(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios.php`);
}
// Método para actualizar el rol de un usuario (solo para admin)
actualizarRolUsuario(id: number, rol: 'admin' | 'user'): Observable<any> {
  return this.http.put(`${this.apiUrl}/usuarios.php`, { id, rol });
}


  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('user_session');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  // Helper rápido para verificar el rol actual
  obtenerRol(): 'admin' | 'user' | null {
    const usuario = this.currentUserSignal();
    return usuario ? usuario.rol : null;
  }
}
