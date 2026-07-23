import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  private readonly authService = inject(AuthService);
  protected readonly usuario = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
  }
}