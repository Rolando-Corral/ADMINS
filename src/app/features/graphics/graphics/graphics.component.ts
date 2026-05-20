import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model.ts';
import { StockService } from 'src/app/services/stockService/stock-service.service';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit {

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  
  public assetsUSD: AssetModelTs[] = [];
  public isUpdatingPrices: boolean = false;
  public isLoading: boolean = false;

  constructor(private assetsService: AssetsService, private stockService: StockService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.isLoading = true;
    
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.assetsUSD = assets; // Guardar los assets
        const posiciones = assets.filter(a => a.category === 'posición');
        
        // Leer precios del localStorage
        posiciones.forEach(position => {
          const cached = localStorage.getItem(`stock_${position.countName}`);
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              position.currentValueUsd = cachedData.price;
            } catch (e) {
              console.error('Error leyendo cache para', position.countName, e);
            }
          }
        });

        const labels = posiciones.map(a => a.countName);
        const acquisitionData = posiciones.map(a => a.acquisitionCostUsd || 0);
        const currentData = posiciones.map(a => (a.currentValueUsd || 0) * (a.shares || 1));

        this.barChartData = {
          labels: labels,
          datasets: [
            { 
              data: acquisitionData, 
              label: 'Precio de compra (USD)', 
              backgroundColor: '#646665',
              hoverBackgroundColor: '#353636'
            },
            { 
              data: currentData, 
              label: 'Valor actual (USD)', 
              backgroundColor: '#0d6efd',
              hoverBackgroundColor: '#24b8fc'
            }
          ]
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando assets para gráficos:', err);
        this.isLoading = false;
      }
    });
  }

  refreshChartData(){
    const posiciones = this.assetsUSD.filter(a => a.category === 'posición');
    
    if (posiciones.length === 0) return;
    
    console.log(`Actualizando ${posiciones.length} posiciones:`, posiciones.map(p => p.countName));
    
    this.isUpdatingPrices = true;
    let completed = 0;
    
    posiciones.forEach((asset, index) => {
      setTimeout(() => {
        console.log(`Consultando precio de ${asset.countName}...`);
        this.stockService.getPrice(asset.countName).subscribe({
          next: (price) => {
            console.log(`✓ ${asset.countName}: $${price}`);
            asset.currentValueUsd = price;
            // Guardar en localStorage (cache de StockService)
            const cached = {
              price: price,
              timestamp: Date.now()
            };
            localStorage.setItem(`stock_${asset.countName}`, JSON.stringify(cached));
            completed++;
            if (completed === posiciones.length) {
              this.isUpdatingPrices = false;
              console.log('Actualización completada');
              this.loadChartData(); // Recargar el gráfico con los nuevos precios
            }
          },
          error: (err) => {
            console.error(`✗ Error obteniendo precio de ${asset.countName}:`, err);
            completed++;
            if (completed === posiciones.length) {
              this.isUpdatingPrices = false;
              console.log('Actualización completada (con errores)');
              this.loadChartData(); // Recargar el gráfico con los nuevos precios
            }
          }
        });
      }, index * 12000); // 12 segundos de delay entre cada consulta
    });
  }
}