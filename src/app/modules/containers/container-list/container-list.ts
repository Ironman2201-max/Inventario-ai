import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContainerService } from '../services/container.service';
import { Container } from '../models/container.models';

@Component({
  selector: 'app-container-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './container-list.html',
  styleUrl: './container-list.css'
})
export class ContainerList implements OnInit {
  private readonly containerService = inject(ContainerService);

  // Signals para manejar el inventario y estado de la UI
  protected readonly contenedores = signal<Container[]>([]);
  protected readonly cargando = signal<boolean>(true);
  protected readonly error = signal<string>('');

  // 🔍 Signal para el filtro/buscador en tiempo real
  protected readonly terminoBusqueda = signal<string>('');

  // 🔍 Computed: Filtra en tiempo real por código, tipo, bodega o slot
  protected readonly contenedoresFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.contenedores();

    return this.contenedores().filter(c => 
      c.code.toLowerCase().includes(termino) ||
      c.type.toLowerCase().includes(termino) ||
      (c.warehouse && c.warehouse.toLowerCase().includes(termino)) ||
      (c.slot && c.slot.toLowerCase().includes(termino))
    );
  });

  ngOnInit(): void {
    this.cargarInventario();
  }

  protected cargarInventario(): void {
    this.cargando.set(true);
    this.error.set('');

    this.containerService.obtenerContenedores().subscribe({
      next: (data: Container[]) => {
        // 🔒 FILTRO CLAVE: Mostramos solo las unidades que NO tienen fecha de salida (Siguen en patio)
        const activosEnPatio = data.filter(c => 
          !c.exit_date || 
          c.exit_date.trim() === '' || 
          c.exit_date.startsWith('0000-00-00')
        );

        this.contenedores.set(activosEnPatio);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al traer contenedores:', err);
        this.error.set('No se pudo conectar con el servidor para cargar el inventario.');
        this.cargando.set(false);
      }
    });
  }
}