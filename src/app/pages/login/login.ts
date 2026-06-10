import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signal para manejar los mensajes de error en la pantalla
  protected readonly mensajeError = signal('');

  // Estructura del formulario reactivo
  protected readonly loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.mensajeError.set('');

    // Enviamos los datos limpios (.value) a tu backend de XAMPP
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const rol = this.authService.obtenerRol();
        
        // Redirección inteligente según el rol guardado en el Signal
        if (rol === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'Error al iniciar sesión.');
      }
    });
  }
}