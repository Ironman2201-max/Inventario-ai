<<<<<<< HEAD
import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
=======
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
>>>>>>> d041a0d029502f074eb7e199e42f0afe106b454b
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private readonly authService = inject(AuthService);
<<<<<<< HEAD
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
=======
  
  // Exponemos el Signal del usuario para usarlo en el HTML
  protected readonly usuario = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
  }
>>>>>>> d041a0d029502f074eb7e199e42f0afe106b454b
}