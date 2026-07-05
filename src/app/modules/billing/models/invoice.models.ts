// invoice.models.ts

export interface FacturaRequest {
  container_id: number;
  user_id: number;

  // Datos del cliente
  customer_name: string;
  customer_nit: string;
  dv?: string;

  // Información tributaria
  legal_organization_id: number;       // 1 = Jurídica, 2 = Natural
  identification_document_id: number;  // 3 = NIT, 1 = Cédula
  municipality_id?: number;            // 148 = Buenaventura

  // Contacto
  address?: string;
  email?: string;
  phone?: string;

  // Valores
  subtotal: number;
}

export interface FacturaResponse {
  status: string;
  message: string;
  number: string;
  cufe: string;
  public_url: string;
}