import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../reports/services/reports.service'; // Revisa que la ruta coincida con tu estructura

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);

  // Control de estados de la interfaz
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly reportesData = signal<any | null>(null);

  // Filtros de fecha local
  protected fechaInicio: string = '';
  protected fechaFin: string = '';

  ngOnInit(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Formatear fechas YYYY-MM-DD
    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];

    this.consultarReportes();
  }

  protected consultarReportes(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.reportsService.obtenerReportes(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.reportesData.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error local al obtener reportes:', err);
        this.error.set(err?.error?.message || 'Error de conexión con el backend local.');
        this.cargando.set(false);
      }
    });
  }

  protected imprimirReporte(): void {
    window.print();
  }
}