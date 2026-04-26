import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModelTs } from 'src/app/interfaces/asset.model.ts';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';
import { DollarServiceTsService } from 'src/app/services/dollar/dollar.service.ts.service';

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

  constructor(private dollarService: DollarServiceTsService, private assetsService: AssetsService) { }

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

}
