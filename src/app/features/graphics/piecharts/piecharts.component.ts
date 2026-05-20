import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model.ts';

@Component({
  selector: 'app-piecharts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './piecharts.component.html',
  styleUrls: ['./piecharts.component.scss']
})
export class PiechartsComponent implements OnInit {


  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };


  public isLoading: boolean = false;
  // Mantengo esta propiedad para saber cuántos assets tenemos inicialmente
  public allAssets: AssetModelTs[] = []; 


  constructor(private assetsService: AssetsService) { }


  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.isLoading = true;
    
    // Define aquí el umbral mínimo de porcentaje que deseas mostrar.
    // Ejemplo: 5 significa que solo se mostrarán assets con al menos el 5% del capital total.
    const MIN_PERCENTAGE_THRESHOLD = 9; 

    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        // Guardamos todos los assets para referencia, aunque solo usemos una categoría
        this.allAssets = assets; 

        // Filtramos por la categoría de posición
        const posiciones = assets.filter(a => a.category === 'posición');

        // --- PASO 1: Procesar y calcular el valor individual de cada posición ---
        let processedPositions: any[] = []; 

        posiciones.forEach(position => {
          // Lógica original para leer precios del localStorage (se mantiene)
          const cached = localStorage.getItem(`stock_${position.countName}`);
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              position.currentValueUsd = cachedData.price;
            } catch (e) {
              console.error('Error leyendo cache para', position.countName, e);
            }
          }

          // Calcular el valor actual total de la posición
          const value = (position.currentValueUsd || 0) * (position.shares || 1);

          processedPositions.push({
            label: position.countName, // Nombre del asset
            value: value,              // Valor calculado
            asset: position            // Referencia al objeto completo si es necesario
          });
        });


        // --- PASO 2: Calcular el valor total de la cartera (el denominador) ---
        const totalValue = processedPositions.reduce((sum, item) => sum + item.value, 0);

        if (totalValue === 0) {
            console.warn('El valor total de los activos es cero. No se puede generar el gráfico.');
            this.pieChartData = { labels: [], datasets: [] };
            this.isLoading = false;
            return; // Salir si no hay valor
        }

        // --- PASO 3: Aplicar el filtro y recolectar los datos finales ---
        const filteredData = processedPositions.filter(item => {
          // Calcular porcentaje para este asset respecto al total
          const percentage = (item.value / totalValue) * 100;
          
          // Filtramos si: 
          // 1. El porcentaje es mayor o igual al umbral definido, Y
          // 2. El valor no es cero (para evitar datos nulos en el gráfico).
          return percentage >= MIN_PERCENTAGE_THRESHOLD && item.value > 0;
        });


        // --- PASO 4: Preparar la estructura de datos para Chart.js ---
        const labels = filteredData.map(item => item.label);
        const values = filteredData.map(item => item.value);

        this.pieChartData = {
          labels: labels,
          datasets: [
            {
              data: values,
              label: 'Valor actual (USD)',
              backgroundColor: [
                '#0d6efd', '#198754', '#ffc107', '#dc3545',
                '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'
              ],
              hoverBackgroundColor: [
                '#0a58ca', '#146c43', '#dda704', '#b02a37',
                '#5a32a3', '#e06b0a', '#1ba87e', '#d23380'
              ]
            }
          ]
        };


        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando assets para gráfico circular:', err);
        this.isLoading = false;
      }
    });
  }

}
