import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly http = inject(HttpClient);
  // Usa la variable de entorno que apunta a tu backend local (ej: http://localhost/sgp_backend)
  private readonly apiUrl = `${environment.apiUrl}/reportes.php`;

  obtenerReportes(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<any>(this.apiUrl, { params });
  }
}