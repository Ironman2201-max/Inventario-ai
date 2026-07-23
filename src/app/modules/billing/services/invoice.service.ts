import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaRequest, FacturaResponse } from '../models/invoice.models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly http = inject(HttpClient);
  // 🔒 URL actualizada a tu nuevo VPS con HTTPS y pasando por el proxy Nginx
  
  private readonly apiUrl = 'https://162-35-169-164.sslip.io/api/facturas.php';
  //private readonly apiUrl = 'http://localhost/angular-backend/facturas.php';

  // Enviar datos para validar y timbrar ante la DIAN mediante Factus
  emitirFactura(datos: FacturaRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(this.apiUrl, datos);
  }

  // Obtener el historial local de facturas emitidas
  obtenerFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
