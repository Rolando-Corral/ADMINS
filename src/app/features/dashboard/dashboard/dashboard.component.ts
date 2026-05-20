import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model';
import { AssetsService } from 'src/app/core/services/assets/assets.service.ts.service';
import { DollarServiceTsService } from 'src/app/core/services/dollar/dollar.service.ts.service';
import { StockService } from 'src/app/core/services/stockService/stock-service.service';

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
  public fixedTerm: AssetModelTs[] = [];
  public allPositions: AssetModelTs[] = [];
  public capitalTotal: number = 0;
  public isAPosition: boolean = false;
  public isUpdatingPrices: boolean = false;

  constructor(
    private dollarService: DollarServiceTsService,
    private assetsService: AssetsService,
  ) { }

  ngOnInit(): void {
    this.myAssets();
    this.showDollarRate();
    this.showOnlyDollars();
    this.showOnlyPositions();
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

  myAssets(): void {
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.assetsARS = assets.filter(asset => asset.currency === 'ARS');
        this.assetsUSD = assets.filter(asset => asset.currency === 'USD');

        // Leer precios desde localStorage (cache de StockService)
        this.assetsUSD.forEach(asset => {
          const cached = localStorage.getItem(`stock_${asset.countName}`);
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              asset.currentValueUsd = cachedData.price;
            } catch (e) {
              console.error('Error leyendo cache para', asset.countName, e);
            }
          }
        });
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    });
  }

  // filtrar solo dolares
  showOnlyDollars() {
    // this.fixedTerm = this.assetsUSD.filter(asset => asset.category === 'plazo fijo en USD');
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.fixedTerm = assets.filter(asset => asset.category === 'plazo fijo en USD');
        console.log('saldo en dolares: ', this.fixedTerm);
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    })
  }

  showOnlyPositions() {
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.allPositions = assets.filter(asset => asset.category === 'posición');
        console.log('posiciones: ', this.allPositions);
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    })
  }

  calcularCapitalTotal(): number {
    const totalARS = this.assetsARS.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSD = this.assetsUSD.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSDInARS = totalUSD * this.valores[0];

    return totalARS + totalUSDInARS;
  }

  calcularTotalInShares(): string|number {
    const preTotalUSD = this.assetsUSD.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    let totalUSD = preTotalUSD - this.fixedTerm.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    return totalUSD.toFixed(2);
  }


}