import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
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

  // 🔽 Eliminamos el campo 'rol' de las validaciones del formulario
  protected readonly registroForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
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

    // Al enviar los datos, Angular mandará solo nombre, correo y contraseña.
    // Tu archivo 'registro.php' en XAMPP ya está programado para ponerle 'user' 
    // por defecto si no le llega este campo.
    this.authService.registrar(this.registroForm.value).subscribe({
      next: () => {
        this.mensajeExito.set('¡Registro exitoso! Guardado como Usuario Regular.');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.message || 'Error al registrar.');
      }
    });
  }
}