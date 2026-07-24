import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './invoice-history.html',
  styleUrls: ['./invoice-history.css']
})
export class InvoiceHistory implements OnInit {
  private readonly invoiceService = inject(InvoiceService);

  // Signals de estado
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly listaFacturas = signal<any[]>([]);
  
  // 🔍 Signal para búsqueda en tiempo real
  protected readonly busquedaFactura = signal<string>('');

  // 🔍 Computed para filtrar las facturas por número, NIT, cliente o contenedor
  protected readonly facturasFiltradas = computed(() => {
    const termino = this.busquedaFactura().toLowerCase().trim();
    if (!termino) return this.listaFacturas();

    return this.listaFacturas().filter(f => 
      (f.number && f.number.toLowerCase().includes(termino)) ||
      (f.customer_name && f.customer_name.toLowerCase().includes(termino)) ||
      (f.customer_nit && f.customer_nit.toLowerCase().includes(termino)) ||
      (f.container_code && f.container_code.toLowerCase().includes(termino))
    );
  });

  ngOnInit(): void {
    this.cargarHistorialFacturas();
  }

  protected cargarHistorialFacturas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.invoiceService.obtenerFacturas().subscribe({
      next: (data: any[]) => {
        this.listaFacturas.set(data);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar historial de facturas:', err);
        this.error.set(err?.error?.message || 'No se pudo obtener el historial de facturas desde el servidor.');
        this.cargando.set(false);
      }
    });
  }
}