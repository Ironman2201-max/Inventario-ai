import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import { AuthService } from '../../../services/auth';
import { FacturaRequest, FacturaResponse } from '../models/invoice.models';
import { ContainerService } from '../../containers/services/container.service';
import { Container } from '../../containers/models/container.models';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './invoice-form.html',
  styleUrls: ['./invoice-form.css']
})
export class InvoiceForm implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly containerService = inject(ContainerService);
  private readonly authService = inject(AuthService);

  // Signals para estados de la interfaz
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly facturaExitosa = signal<FacturaResponse | null>(null);

  // Signal para contenedores despachados (con fecha de salida)
  protected readonly contenedoresDespachados = signal<Container[]>([]);
  // 🔍 Signal para el filtro/buscador en tiempo real de contenedores
  protected readonly busquedaContenedor = signal<string>('');

  // 📄 Signal para la lista de facturas generadas (Historial)
  protected readonly listaFacturas = signal<any[]>([]);
  protected readonly busquedaFactura = signal<string>('');

  // Datos del formulario vinculados por [(ngModel)]
  protected form = {
    container_id: '',
    customer_name: '',
    customer_nit: '',
    dv: '',
    legal_organization_id: 2, // 2 = Persona Natural por defecto
    identification_document_id: 1, // 1 = Cédula de Ciudadanía
    subtotal: 0,
    email: '',
    address: 'Zona Portuaria - Buenaventura'
  };

  // 🔍 Computed para filtrar contenedores despachados en el select dinámico
  protected readonly contenedoresFiltrados = computed(() => {
    const termino = this.busquedaContenedor().toLowerCase().trim();
    if (!termino) return this.contenedoresDespachados();

    return this.contenedoresDespachados().filter(c => 
      c.code.toLowerCase().includes(termino) ||
      c.type.toLowerCase().includes(termino) ||
      (c.warehouse && c.warehouse.toLowerCase().includes(termino))
    );
  });

  // 🔍 Computed para filtrar las facturas generadas en el historial
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
    this.cargarUnidadesDespachadas();
    this.cargarHistorialFacturas();
  }

  private cargarUnidadesDespachadas(): void {
    this.containerService.obtenerContenedores().subscribe({
      next: (data: Container[]) => {
        // 📦 Filtramos unidades que posean una fecha de salida registrada
        const despachados = data.filter(c => c.exit_date && c.exit_date.trim() !== '' && c.exit_date !== '0000-00-00 00:00:00');
        this.contenedoresDespachados.set(despachados);
      },
      error: (err: any) => {
        console.error('Error al cargar contenedores despachados:', err);
        this.error.set(err?.error?.message || 'No se pudieron cargar las unidades despachadas desde el servidor.');
      }
    });
  }

  protected cargarHistorialFacturas(): void {
    this.invoiceService.obtenerFacturas().subscribe({
      next: (data: any[]) => this.listaFacturas.set(data),
      error: (err: any) => console.error('Error al cargar el historial de facturas:', err)
    });
  }

  protected onLegalOrganizationChange(): void {
    if (Number(this.form.legal_organization_id) === 1) {
      this.form.identification_document_id = 3; // NIT
    } else {
      this.form.identification_document_id = 1; // Cédula
      this.form.dv = '';
    }
  }

  protected procesarFactura(): void {
    if (!this.form.container_id || !this.form.customer_name || !this.form.customer_nit || this.form.subtotal <= 0) {
      this.error.set('Por favor, seleccione un contenedor despachado, complete la información del cliente y asigne un subtotal mayor a cero.');
      return;
    }

    if (Number(this.form.legal_organization_id) === 1 && !this.form.dv) {
      this.error.set('El Dígito de Verificación (DV) es obligatorio para Personas Jurídicas.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.facturaExitosa.set(null);

    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id ? Number(currentUser.id) : 1;

    const payload: FacturaRequest = {
      container_id: Number(this.form.container_id),
      user_id: userId,
      customer_name: this.form.customer_name.trim(),
      customer_nit: this.form.customer_nit.trim(),
      subtotal: Number(this.form.subtotal),
      legal_organization_id: Number(this.form.legal_organization_id),
      identification_document_id: Number(this.form.identification_document_id),
      address: this.form.address.trim(),
      email: this.form.email.trim() || 'facturacion@cliente.com',
      municipality_id: 148 // Código DANE Buenaventura
    };

    if (Number(this.form.legal_organization_id) === 1 && this.form.dv) {
      payload.dv = this.form.dv.trim();
    }

    this.invoiceService.emitirFactura(payload).subscribe({
      next: (res) => {
        this.facturaExitosa.set(res);
        this.cargando.set(false);
        this.limpiarFormulario();
        this.cargarUnidadesDespachadas(); // Recargar select
        this.cargarHistorialFacturas();   // 🔄 Actualizar tabla de historial de facturas
      },
      error: (err: any) => {
        console.error('Error al emitir factura:', err);
        this.error.set(err?.error?.message || 'Error al conectar con la pasarela de Factus/DIAN.');
        this.cargando.set(false);
      }
    });
  }

  private limpiarFormulario(): void {
    this.form.container_id = '';
    this.form.customer_name = '';
    this.form.customer_nit = '';
    this.form.dv = '';
    this.form.subtotal = 0;
    this.form.email = '';
    this.form.legal_organization_id = 2;
    this.form.identification_document_id = 1;
    this.busquedaContenedor.set('');
  }
}