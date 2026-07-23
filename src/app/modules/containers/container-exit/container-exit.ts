
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Container } from '../models/container.models';   
import { ContainerService } from '../services/container.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-container-exit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './container-exit.html',
  styleUrl: './container-exit.css'
})
export class ContainerExit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly containerService = inject(ContainerService);
  private readonly authService = inject(AuthService);

  protected readonly error = signal('');
  protected readonly gpsCargado = signal(false);
  protected readonly latitudVisual = signal<number | null>(null);
  protected readonly longitudVisual = signal<number | null>(null);
  protected readonly nodoTerminal = signal('Terminal Marítima - Buenaventura, CO');

  // Listado de contenedores en patio para seleccionar
  protected readonly listaContenedores = signal<Container[]>([]);
  protected readonly contenedorSeleccionado = signal<Container | null>(null);

  // Signals para el modal de estado
  protected readonly mostrarModal = signal(false);
  protected readonly estadoModal = signal<'cargando' | 'exito'>('cargando');

  private coords = { latitude: 0, longitude: 0 };

  protected readonly exitForm = this.fb.group({
    container_id: ['', Validators.required],
    observations: ['']
  });

  // Cálculo en tiempo real del tiempo de permanencia usando signals computed
  protected readonly estadiaCalculada = computed(() => {
    const seleccionado = this.contenedorSeleccionado();
    if (!seleccionado || !seleccionado.entry_date) return null;

    const fechaIngreso = new Date(seleccionado.entry_date);
    const fechaSalida = new Date(); // Fecha actual del sistema

    return this.calcularDiferenciaTiempo(fechaIngreso, fechaSalida);
  });

  ngOnInit(): void {
    this.capturarGPS();
    this.cargarContenedoresEnPatio();

    // Escuchar cambios en la selección para actualizar el cálculo visual de forma reactiva
    this.exitForm.get('container_id')?.valueChanges.subscribe(id => {
      const encontrado = this.listaContenedores().find(c => c.id === Number(id)) || null;
      this.contenedorSeleccionado.set(encontrado);
    });
  }

  private async capturarGPS(): Promise<void> {
    try {
      this.coords = await this.containerService.obtenerUbicacionGPS();
      this.latitudVisual.set(this.coords.latitude);
      this.longitudVisual.set(this.coords.longitude);
      this.gpsCargado.set(true);
    } catch (err) {
      this.error.set('No se pudo obtener la señal GPS obligatoria para registrar la salida.');
    }
  }

  private cargarContenedoresEnPatio(): void {
    this.containerService.obtenerContenedores().subscribe({
      next: (data) => {
        this.listaContenedores.set(data);
      },
      error: () => this.error.set('Error al cargar las unidades del patio.')
    });
  }

  private calcularDiferenciaTiempo(inicio: Date, fin: Date) {
    const diffMs = fin.getTime() - inicio.getTime();
    if (diffMs < 0) return { texto: '0 minutos', horasTotales: 0 };

    const totalMinutos = Math.floor(diffMs / (1000 * 60));
    const dias = Math.floor(totalMinutos / (24 * 60));
    const horas = Math.floor((totalMinutos % (24 * 60)) / 60);
    const minutos = totalMinutos % 60;

    let texto = '';
    if (dias > 0) texto += `${dias}d `;
    if (horas > 0 || dias > 0) texto += `${horas}h `;
    texto += `${minutos}m`;

    return {
      texto,
      horasTotales: Number((diffMs / (1000 * 60 * 60)).toFixed(2))
    };
  }

  protected registrarSalida(): void {
    if (this.exitForm.invalid || !this.gpsCargado()) {
      this.exitForm.markAllAsTouched();
      return;
    }

    const formValues = this.exitForm.value;
    const idContenedor = Number(formValues.container_id);
    const idUsuarioActual = this.authService.currentUser()?.id ? Number(this.authService.currentUser()?.id) : 2; // Operario o Admin por defecto
    const permanencia = this.estadiaCalculada();

    this.error.set('');
    this.estadoModal.set('cargando');
    this.mostrarModal.set(true);

    const nuevoMovimiento = {
      container_id: idContenedor,
      user_id: idUsuarioActual,
      movement_type: 'EXIT' as const,
      latitude: this.coords.latitude,
      longitude: this.coords.longitude,
      hours_elapsed: permanencia?.horasTotales || 0,
      observations: formValues.observations || ''
    };

    // Registrar la traza del movimiento de salida en el servidor
    this.containerService.registrarMovimiento(nuevoMovimiento).subscribe({
      next: () => {
        this.estadoModal.set('exito');
        this.exitForm.reset();
        this.contenedorSeleccionado.set(null);
        
        // Recargar el inventario de contenedores que quedan en el patio
        this.cargarContenedoresEnPatio();

        setTimeout(() => {
          this.mostrarModal.set(false);
        }, 2500);
      },
      error: (err) => {
        this.mostrarModal.set(false);
        this.error.set(err.error?.message || 'Error al procesar el despacho en el servidor.');
      }
    });
  }
}