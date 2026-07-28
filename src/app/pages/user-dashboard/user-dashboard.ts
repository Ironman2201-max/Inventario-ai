import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Datos del usuario autenticado desde el Signal
  protected readonly usuario = this.authService.currentUser;

  // 📦 Redirección directa al inventario/gestión de patio
  protected irAContenedores(): void {
    this.router.navigate(['/contenedores/inventario']);
  }

  // 🧾 Redirección al formulario de emisión de facturas DIAN
  protected irAFacturacion(): void {
    this.router.navigate(['/facturacion']);
  }

  protected logout(): void {
    this.authService.logout();
  }
}