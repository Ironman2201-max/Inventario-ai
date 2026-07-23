import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, Movement } from '../models/container.models';


@Injectable({
  providedIn: 'root'
})

export class ContainerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://162-35-169-164.sslip.io/api';
  

  // Captura de GPS Nativo mediante Promesa
  obtenerUbicacionGPS(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por el navegador.'));
      }
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => reject(error)
      );
    });
  }

  registrarContenedor(container: Container): Observable<any> {
    return this.http.post(`${this.apiUrl}/contenedores.php`, container);
  }

  registrarMovimiento(movement: Movement): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimientos.php`, movement);
  }

  obtenerContenedores(): Observable<Container[]> {
    return this.http.get<Container[]>(`${this.apiUrl}/contenedores.php`);
  }
  obtenerHistorialMovimientos(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.apiUrl}/movimientos.php`);
  }



}
