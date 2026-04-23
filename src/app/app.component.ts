import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DollarServiceTsService } from './services/dollar/dollar.service.ts.service';
import { AssetsService } from './services/assets/assets.service.ts.service';
import { AssetModelTs } from './interfaces/asset.model.ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  title = 'ADMIN$';
  valores: number[] = [];
  fechaActualizacion: string = '';

  // public barChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  // };

  // public barChartType: ChartType = 'bar';

  // public barChartData: ChartConfiguration['data'] = {
  //   labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  //   datasets: [
  //     { data: [65, 59, 80, 81, 56, 55], label: 'Ingresos', backgroundColor: '#198754' },
  //     { data: [28, 48, 40, 19, 86, 27], label: 'Gastos', backgroundColor: '#dc3545' }
  //   ]
  // };

  constructor(private dollarService: DollarServiceTsService) { }

  ngOnInit() {
    this.showDollarRate();
  }
  showDollarRate() {
    this.dollarService.getDollarRate().subscribe(data => {
      this.valores = [data.compra, data.venta];
      this.fechaActualizacion = data.fechaActualizacion;
    });


  }

}
