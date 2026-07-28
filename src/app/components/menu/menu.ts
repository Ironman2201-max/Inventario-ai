import { Component, inject, signal, computed, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly usuario = this.authService.currentUser;

  // Estado del menú en móviles (Abierto / Cerrado)
  protected readonly menuMovilAbierto = signal<boolean>(false);
  
  // Estado del submenú desplegable
  protected readonly menuPatioAbierto = signal<boolean>(false);

  protected readonly esAdmin = computed(() => {
    const rol = this.usuario()?.rol?.toLowerCase().trim();
    return rol === 'admin' || rol === 'administrador';
  });

  protected readonly esOperador = computed(() => {
    const rol = this.usuario()?.rol?.toLowerCase().trim();
    return rol === 'operario' || rol === 'operador' || rol === 'user' || this.esAdmin();
  });

  protected toggleMenuMovil(): void {
    this.menuMovilAbierto.update(v => !v);
  }

  protected toggleMenuPatio(): void {
    this.menuPatioAbierto.update(v => !v);
  }

  protected navegarYcerrar(ruta: string): void {
    this.router.navigate([ruta]);
    this.menuPatioAbierto.set(false);
    this.menuMovilAbierto.set(false); // Cierra el menú al navegar en teléfono
  }

  protected cerrarMenuPatio(): void {
    this.menuPatioAbierto.set(false);
  }

  protected logout(): void {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuPatioAbierto.set(false);
      this.menuMovilAbierto.set(false);
    }
  }
}