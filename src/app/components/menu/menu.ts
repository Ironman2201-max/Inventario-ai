import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private readonly authService = inject(AuthService);
  
  // Exponemos el Signal del usuario para usarlo en el HTML
  protected readonly usuario = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
  }
}