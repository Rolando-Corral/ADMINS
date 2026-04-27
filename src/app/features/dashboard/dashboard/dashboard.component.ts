import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModelTs } from 'src/app/interfaces/asset.model.ts';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';
import { DollarServiceTsService } from 'src/app/services/dollar/dollar.service.ts.service';
import { StockService } from 'src/app/services/stockService/stock-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public valores: number[] = [];
  public fechaActualizacion: string = '';
  public assetsARS: AssetModelTs[] = [];
  public assetsUSD: AssetModelTs[] = [];
  public capitalTotal: number = 0;
  public isAPosition: boolean = false;
  public isUpdatingPrices: boolean = false;

  constructor(
    private dollarService: DollarServiceTsService, 
    private assetsService: AssetsService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.myAssets();
    this.showDollarRate();
  }

   showDollarRate() {
    this.dollarService.getDollarRate().subscribe(data => {
      this.valores = [data.compra, data.venta];
      this.fechaActualizacion = data.fechaActualizacion;
      this.capitalTotal = this.calcularCapitalTotal();
    });
  }

  getdollarRate(): Observable<{ compra: number; venta: number; fechaActualizacion: string; }> {
    return this.dollarService.getDollarRate();
  }

  myAssets() {
    const assets = this.assetsService.getAssets();
    this.assetsARS = assets.filter(asset => asset.currency === 'ARS');
    this.assetsUSD = assets.filter(asset => asset.currency === 'USD');
  }

  calcularCapitalTotal(): number {
    const totalARS = this.assetsARS.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSD = this.assetsUSD.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSDInARS = totalUSD * this.valores[0]; 
    
    return totalARS + totalUSDInARS;
  }

  updateStockPrices(): void {
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
            completed++;
            if (completed === posiciones.length) {
              this.isUpdatingPrices = false;
              console.log('Actualización completada');
            }
          },
          error: (err) => {
            console.error(`✗ Error obteniendo precio de ${asset.countName}:`, err);
            completed++;
            if (completed === posiciones.length) {
              this.isUpdatingPrices = false;
              console.log('Actualización completada (con errores)');
            }
          }
        });
      }, index * 12000); // 12 segundos de delay entre cada consulta
    });
  }

}
