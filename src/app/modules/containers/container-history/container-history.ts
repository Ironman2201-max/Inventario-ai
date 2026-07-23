import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ContainerService } from '../services/container.service';



interface MovimientoSalida {
  id: number;
  container_code: string;
  operator_name: string;
  movement_type: 'ENTRY' | 'EXIT';
  latitude: number;
  longitude: number;
  created_at: string; // Fecha de salida (registro del movimiento)
  entry_date?: string; // Fecha en la que ingresó el contenedor
  observations?: string;
  hours_elapsed?: number; // Tiempo calculado en base de datos
}

@Component({
  selector: 'app-container-history',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './container-history.html',
  styleUrl: './container-history.css'
})


export class ContainerHistory implements OnInit {
  private readonly containerService = inject(ContainerService);

  protected readonly movimientosSalida = signal<MovimientoSalida[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargarHistorialDespachos();
  }

  protected cargarHistorialDespachos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.containerService.obtenerHistorialMovimientos().subscribe({
      // Usamos el GET del historial que ya definiste en movimientos.php
      next: (data: any[]) => {
        // Filtramos solo los movimientos que sean salidas ('EXIT')
        const salidas = data
          .filter(m => m.movement_type === 'EXIT')
          .map(m => ({
            ...m,
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
            hours_elapsed: m.hours_elapsed ? Number(m.hours_elapsed) : undefined
          }));
        
        this.movimientosSalida.set(salidas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo obtener el historial de despachos desde el servidor XAMPP.');
        this.cargando.set(false);
      }
    });
  }

  // Método auxiliar para dar formato visual amigable al tiempo de estadía
  protected darFormatoEstadia(horasTotales: number | undefined): string {
    if (horasTotales === undefined || horasTotales === null) return 'N/A';
    if (horasTotales === 0) return 'Menos de 1 hora';

    const dias = Math.floor(horasTotales / 24);
    const horas = horasTotales % 24;

    let txt = '';
    if (dias > 0) txt += `${dias} día(s) `;
    if (horas > 0) txt += `${horas} hora(s)`;
    return txt.trim();
  }
}