import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';

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
      legend: {
        display: true
      }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    const assets = this.assetsService.getAssets();
    const posiciones = assets.filter(a => a.category === 'posición');

    const labels = posiciones.map(a => a.countName);
    const acquisitionData = posiciones.map(a => a.acquisitionCostUsd);
    const currentData = posiciones.map(a => a.currentValueUsd || 0);

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
          label: 'Precio actual (USD)', 
          backgroundColor: '#0d6efd',
          hoverBackgroundColor: '#24b8fc'
        }
      ]
    };
  }
}