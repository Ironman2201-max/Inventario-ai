import { Component as AngularComponent, inject as AngularInject, signal as AngularSignal, OnInit as AngularOnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth';

@AngularComponent({
  selector: 'app-gestion-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuarios implements AngularOnInit {
  private readonly authService = AngularInject(AuthService);

  protected readonly listaUsuarios    = AngularSignal<Usuario[]>([]);
  protected readonly mensajeExito     = AngularSignal('');
  protected readonly guardando        = AngularSignal(false);

  // ✅ Signal reactivo en lugar de Map normal
  protected readonly cambiosPendientes = AngularSignal<Record<number, 'admin' | 'user'>>({});

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.authService.obtenerTodosLosUsuarios().subscribe({
      next:  (usuarios) => this.listaUsuarios.set(usuarios),
      error: (err)      => console.error('Error al cargar usuarios', err)
    });
  }

  protected getRolPendiente(id: number): 'admin' | 'user' | null {
    return this.cambiosPendientes()[id] ?? null;
  }

  protected tieneCambioPendiente(id: number): boolean {
    // ✅ Lee el Signal — Angular detecta la dependencia y re-evalúa el @if
    return id in this.cambiosPendientes();
  }

  protected marcarCambio(id: number, nuevoRol: 'admin' | 'user'): void {
    const rolActual = this.listaUsuarios().find(u => u.id === id)?.rol;

    if (nuevoRol === rolActual) {
      // Volvió al original → elimina el pendiente
      this.cambiosPendientes.update(prev => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    } else {
      // ✅ update() crea un objeto nuevo → Signal detecta el cambio
      this.cambiosPendientes.update(prev => ({ ...prev, [id]: nuevoRol }));
    }
  }

  protected guardarRol(usuarioId: number): void {
    const nuevoRol = this.cambiosPendientes()[usuarioId];
    if (!nuevoRol) return;

    this.guardando.set(true);

    this.authService.actualizarRolUsuario(usuarioId, nuevoRol).subscribe({
      next: () => {
        this.listaUsuarios.update(usuarios =>
          usuarios.map(u => u.id === usuarioId ? { ...u, rol: nuevoRol } : u)
        );

        // Limpia solo ese pendiente
        this.cambiosPendientes.update(prev => {
          const siguiente = { ...prev };
          delete siguiente[usuarioId];
          return siguiente;
        });

        this.guardando.set(false);
        this.mensajeExito.set('¡Rol actualizado con éxito!');
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: (err) => {
        console.error('Error al actualizar el rol', err);
        this.guardando.set(false);
      }
    });
  }
}