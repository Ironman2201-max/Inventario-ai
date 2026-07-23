import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Container } from '../models/container.models';   
import { ContainerService } from '../services/container.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-container-exit',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
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

  // ⏱️ Cálculo reactivo del tiempo de permanencia corregido
  protected readonly estadiaCalculada = computed(() => {
    const seleccionado = this.contenedorSeleccionado();
    if (!seleccionado || !seleccionado.entry_date) return null;

    // 🛠️ Reemplazar espacio por 'T' para que 'new Date()' sea compatible universalmente
    const fechaISO = seleccionado.entry_date.replace(' ', 'T');
    const fechaIngreso = new Date(fechaISO);
    const fechaSalida = new Date(); // Fecha actual del sistema

    return this.calcularDiferenciaTiempo(fechaIngreso, fechaSalida);
  });

  ngOnInit(): void {
    this.capturarGPS();
    this.cargarContenedoresEnPatio();

    // Escuchar cambios en la selección para actualizar el detalle de forma reactiva
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
        // 🔒 Filtramos para mostrar SOLO los contenedores que siguen en patio (sin fecha de salida)
        const activosEnPatio = data.filter(c => !c.exit_date);
        this.listaContenedores.set(activosEnPatio);
      },
      error: () => this.error.set('Error al cargar las unidades del patio desde XAMPP.')
    });
  }

  private calcularDiferenciaTiempo(inicio: Date, fin: Date) {
    if (isNaN(inicio.getTime())) return { texto: '0m', horasTotales: 0 };

    const diffMs = fin.getTime() - inicio.getTime();
    if (diffMs < 0) return { texto: '0m', horasTotales: 0 };

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
    
    // 👤 Obtenemos los datos del usuario actual autenticado (incluida la Cédula)
    const usuarioActual = this.authService.currentUser();
    const idUsuarioActual = usuarioActual?.id ? Number(usuarioActual.id) : 2;
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
        
        // Recargar el inventario filtrado (la unidad despachada ya no aparecerá)
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