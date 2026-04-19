import { Component, OnInit } from '@angular/core';
import { DollarServiceTsService } from './services/dollar/dollar.service.ts.service';
import { AssetsService } from './services/assets/assets.service.ts.service';
import { AssetModelTs } from './interfaces/asset.model.ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'CRR01';
  valores: number[] = [];
  fechaActualizacion: string = '';
  // myAssetsList: AssetModelTs[] = [];

  assetsARS: AssetModelTs[] = [];
  assetsUSD: AssetModelTs[] = [];

  constructor(private dollarService: DollarServiceTsService, private assetsService: AssetsService) { }

  ngOnInit() {
    this.dollarData();
    this.myAssets();
    this.calcularCapitalTotal();
  }


  dollarData() {
    this.dollarService.getDollarRate()
      .subscribe(
        data => {
          this.valores = [data.compra, data.venta];
          this.fechaActualizacion = data.fechaActualizacion;
        },
        error => {
          console.error('Error fetching dollar rate:', error);
        }
      );
  }

  myAssets() {
    const assets = this.assetsService.getAssets();
    this.assetsARS = assets.filter(asset => asset.currency === 'ARS');
    this.assetsUSD = assets.filter(asset => asset.currency === 'USD');
  }

  // calcular capital total en pesos de los activos en dólares y sumar el capital total de los activos en pesos
  calcularCapitalTotal(): number {
    const totalARS = this.assetsARS.reduce((total, asset) => total + asset.amount, 0);
    const totalUSD = this.assetsUSD.reduce((total, asset) => total + asset.amount, 0);
    const totalUSDInARS = totalUSD * this.valores[0]; // Convertir dólares a pesos usando el valor de compra
    return totalARS + totalUSDInARS;
  }

}





