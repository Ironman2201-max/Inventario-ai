import { Component, inject, signal, OnInit } from '@angular/core';
import { ContainerService } from '../services/container.service';
import { Container } from '../models/container.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-container-list',
  imports: [DatePipe],
  templateUrl: './container-list.html',
  styleUrl: './container-list.css'
})
export class ContainerList implements OnInit {
  private readonly containerService = inject(ContainerService);

  // Signal para almacenar la lista de contenedores en patio
  protected readonly contenedores = signal<Container[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargarInventario();
  }

  protected cargarInventario(): void {
    this.cargando.set(true);
    this.containerService.obtenerContenedores().subscribe({
      next: (data) => {
        this.contenedores.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al traer contenedores:', err);
        this.error.set('No se pudo conectar con el servidor de XAMPP para cargar el inventario.');
        this.cargando.set(false);
      }
    });
  }
}