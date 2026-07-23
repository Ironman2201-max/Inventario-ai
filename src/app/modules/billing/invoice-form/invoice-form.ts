import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import { FacturaRequest } from '../models/invoice.models';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-form.html',
  styleUrls: ['./invoice-form.css']
})
export class InvoiceForm {
  private readonly invoiceService = inject(InvoiceService);

  // Signals para controlar estados de la UI
  protected cargando = signal<boolean>(false);
  protected error = signal<string | null>(null);
  protected facturaExitosa = signal<any | null>(null);

  // Datos del formulario vinculados por [(ngModel)]
  protected form = {
    container_id: '',
    customer_name: '',
    customer_nit: '',
    dv: '',
    legal_organization_id: 2, // 2 = Persona Natural por defecto
    identification_document_id: 1, // 1 = Cédula de ciudadanía
    subtotal: 0,
    email: '',
    address: 'Zona Portuaria - Buenaventura'
  };

  protected procesarFactura(): void {
    // 1. Validaciones básicas iniciales
    if (!this.form.container_id || !this.form.customer_name || !this.form.customer_nit || this.form.subtotal <= 0) {
      this.error.set('Por favor, rellene todos los campos obligatorios y asigne un valor mayor a cero.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.facturaExitosa.set(null);

    // 2. Extraer el usuario autenticado (tal como lo guarda tu login.php)
    const sessionUser = localStorage.getItem('usuario'); 
    const userId = sessionUser ? JSON.parse(sessionUser).id : 1; // Respaldo ID 1 si no hay sesión activa

    const payload: FacturaRequest = {
      container_id: Number(this.form.container_id),
      user_id: Number(userId),
      customer_name: this.form.customer_name,
      customer_nit: this.form.customer_nit,
      subtotal: Number(this.form.subtotal),
      legal_organization_id: Number(this.form.legal_organization_id),
      identification_document_id: Number(this.form.identification_document_id),
      address: this.form.address,
      email: this.form.email || 'correo@cliente.com',
      municipality_id: 148 // Código de Buenaventura en Factus
    };

    // Si es persona jurídica, adjuntar dígito de verificación
    if (this.form.legal_organization_id === 1 && this.form.dv) {
      payload.dv = this.form.dv;
    }

    // 3. Consumir el puente PHP
    this.invoiceService.emitirFactura(payload).subscribe({
      next: (res) => {
        this.facturaExitosa.set(res);
        this.cargando.set(false);
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error de Factus/DIAN:', err);
        this.error.set(err.error?.message || 'Error al conectar con la pasarela de Factus de la DIAN.');
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
  }
}