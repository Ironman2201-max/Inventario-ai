import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly usuario = this.authService.currentUser;

  // Estado del dropdown custom (reemplaza al <select> nativo)
  protected readonly menuPatioAbierto = signal(false);

  protected logout(): void {
    this.authService.logout();
  }

  protected toggleMenuPatio(): void {
    this.menuPatioAbierto.update(v => !v);
  }

  protected navegarYcerrar(ruta: string): void {
    this.router.navigate([ruta]);
    this.menuPatioAbierto.set(false);
  }

  // Cierra el dropdown si el usuario hace clic afuera de él
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuPatioAbierto.set(false);
    }
  }
}