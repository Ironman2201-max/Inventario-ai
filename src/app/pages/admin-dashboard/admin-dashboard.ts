import { Component, inject, signal, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth'; 
import { ReportsService } from '../../reports/services/reports.service';

// Registrar los módulos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reportsService = inject(ReportsService);

  // Referencias a los lienzos de los gráficos
  @ViewChild('incomeChartCanvas') incomeChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('containersChartCanvas') containersChartCanvas!: ElementRef<HTMLCanvasElement>;

  private incomeChartInstance: Chart | null = null;
  private containersChartInstance: Chart | null = null;

  // Datos de usuario y reportes
  protected readonly usuario = this.authService.currentUser;
  protected readonly cargando = signal<boolean>(false);
  protected readonly reportesData = signal<any | null>(null);

  protected fechaInicio: string = '';
  protected fechaFin: string = '';

  ngOnInit(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];

    this.consultarReportes();
  }

  protected consultarReportes(): void {
    this.cargando.set(true);
    this.reportsService.obtenerReportes(this.fechaInicio, this.fechaFin).subscribe({
      next: (data: any) => {
        this.reportesData.set(data);
        this.cargando.set(false);
        
        // Renderizar gráficos tras actualizar los datos
        setTimeout(() => this.renderizarGraficos(data), 100);
      },
      error: (err: unknown) => {
        console.error('Error al obtener métricas del administrador:', err);
        this.cargando.set(false);
      }
    });
  }

  private renderizarGraficos(data: any): void {
    // 1. Destruir instancias previas para evitar sobreposición
    if (this.incomeChartInstance) this.incomeChartInstance.destroy();
    if (this.containersChartInstance) this.containersChartInstance.destroy();

    // --- GRÁFICO 1: Resumen Financiero (Ingresos vs Subtotal vs IVA) ---
    if (this.incomeChartCanvas?.nativeElement) {
      const ctx1 = this.incomeChartCanvas.nativeElement.getContext('2d');
      if (ctx1) {
        this.incomeChartInstance = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['Subtotal Base', 'IVA Recaudado (19%)', 'Total Facturado'],
            datasets: [{
              label: 'Monto ($ COP)',
              data: [
                data.facturacion.subtotal_acumulado,
                data.facturacion.iva_acumulado,
                data.facturacion.ingresos_totales
              ],
              backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => ` $${Number(context.raw).toLocaleString('es-CO')} COP`
                }
              }
            }
          }
        });
      }
    }

    // --- GRÁFICO 2: Distribución por Tipo de Contenedor ---
    if (this.containersChartCanvas?.nativeElement && data.contenedores?.por_tipo) {
      const ctx2 = this.containersChartCanvas.nativeElement.getContext('2d');
      if (ctx2) {
        const labels = data.contenedores.por_tipo.map((t: any) => t.type);
        const cantidades = data.contenedores.por_tipo.map((t: any) => t.total);

        this.containersChartInstance = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: cantidades,
              backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#64748b']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        });
      }
    }
  }

  protected imprimirReporte(): void {
    window.print();
  }

  protected logout(): void {
    this.authService.logout();
  }
}