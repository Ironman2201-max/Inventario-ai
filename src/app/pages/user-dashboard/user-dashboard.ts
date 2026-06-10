import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard {
  private readonly authService = inject(AuthService);
  protected readonly usuario = this.authService.currentUser;

  protected logout(): void {
    this.authService.logout();
    
  }
}