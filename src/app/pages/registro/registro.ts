import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mensajeError = signal('');
  protected readonly mensajeExito = signal('');

  // 📝 Agregamos el control 'cedula' con validación de solo números
  protected readonly registroForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{6,12}$')]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    this.mensajeError.set('');
    this.mensajeExito.set('');

    this.authService.registrar(this.registroForm.value).subscribe({
      next: () => {
        this.mensajeExito.set('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'Error al registrar.');
      }
    });
  }
}