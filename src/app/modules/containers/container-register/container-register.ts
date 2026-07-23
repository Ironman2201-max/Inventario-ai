import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContainerService } from '../services/container.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-container-register',
  imports: [ReactiveFormsModule],
  templateUrl: './container-register.html',
  styleUrl: './container-register.css'
})
export class ContainerRegister implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly containerService = inject(ContainerService);
  private readonly authService = inject(AuthService);

  protected readonly error = signal('');
  protected readonly gpsCargado = signal(false);
  protected readonly latitudVisual = signal<number | null>(null);
  protected readonly longitudVisual = signal<number | null>(null);
  protected readonly nodoTerminal = signal('Terminal Marítima - Buenaventura, CO');

  // 🚨 SIGNALS PARA EL MODAL INTERACTIVO
  protected readonly mostrarModal = signal(false);
  protected readonly estadoModal = signal<'cargando' | 'exito'>('cargando');

  private coords = { latitude: 0, longitude: 0 };

  protected readonly containerForm = this.fb.group({
    code: ['', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{7}$')]],
    type: ['Dry Van', Validators.required],
    customs_status: [false, Validators.required],
    status: ['Operativo', Validators.required],
    warehouse: ['', Validators.required],
    slot: ['', Validators.required]
  });

  ngOnInit(): void {
    this.capturarGPS();
  }

  private async capturarGPS(): Promise<void> {
    try {
      this.coords = await this.containerService.obtenerUbicacionGPS();
      this.latitudVisual.set(this.coords.latitude);
      this.longitudVisual.set(this.coords.longitude);
      this.gpsCargado.set(true);
    } catch (err) {
      this.error.set('No se pudo obtener la señal GPS obligatoria para operar.');
    }
  }

 protected registrarEntrada(): void {
  if (this.containerForm.invalid || !this.gpsCargado()) {
    this.containerForm.markAllAsTouched();
    return;
  }

  const datosContenedor = this.containerForm.value;

  if (!datosContenedor.customs_status) {
    this.error.set('❌ INGRESO BLOQUEADO: El contenedor no cuenta con Autorización Aduanera aprobada.');
    return;
  }

  this.error.set('');
  
  this.estadoModal.set('cargando');
  this.mostrarModal.set(true);

  this.containerService.registrarContenedor(datosContenedor as any).subscribe({
    next: (res) => {
      const idNuevoContenedor = res && res.container_id ? Number(res.container_id) : null;
      
      // 👤 Obtenemos los datos del usuario actual autenticado
      const usuarioActual = this.authService.currentUser();
      const idUsuarioActual = usuarioActual?.id ? Number(usuarioActual.id) : 1;
      const cedulaUsuarioActual = usuarioActual?.cedula || ''; // 👈 Captura de la cédula

      if (!idNuevoContenedor) {
        this.mostrarModal.set(false);
        this.error.set('El servidor no retornó el ID del inventario.');
        return;
      }

      const nuevoMovimiento = {
        container_id: idNuevoContenedor,
        user_id: idUsuarioActual,
        cedula_operador: cedulaUsuarioActual, // 👈 Se envía la cédula del operador
        movement_type: 'ENTRY' as const,
        latitude: this.coords.latitude,
        longitude: this.coords.longitude
      };

      // Enviamos la traza GPS con la identificación del usuario
      this.containerService.registrarMovimiento(nuevoMovimiento).subscribe({
        next: () => {
          this.estadoModal.set('exito');
          this.containerForm.reset({ type: 'Dry Van', customs_status: false, status: 'Operativo' });
          
          setTimeout(() => {
            this.mostrarModal.set(false);
          }, 2500);
        },
        error: () => {
          this.mostrarModal.set(false);
          this.error.set('Contenedor creado, pero falló la traza de movimiento GPS.');
        }
      });
    },
    error: (err) => {
      this.mostrarModal.set(false);
      this.error.set(err.error?.message || 'Error en la conexión con el servidor.');
    }
  });
}

}