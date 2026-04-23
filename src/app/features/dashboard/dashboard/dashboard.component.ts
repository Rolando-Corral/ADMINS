import { Component, OnInit } from '@angular/core';
import { AssetModelTs } from 'src/app/interfaces/asset.model.ts';
import { AssetsService } from 'src/app/services/assets/assets.service.ts.service';
import { DollarServiceTsService } from 'src/app/services/dollar/dollar.service.ts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  valores: number[] = [];
  fechaActualizacion: string = '';

  assetsARS: AssetModelTs[] = [];
  assetsUSD: AssetModelTs[] = [];

  constructor(private dollarService: DollarServiceTsService, private assetsService: AssetsService) { }

  ngOnInit(): void {
    this.myAssets();
    this.calcularCapitalTotal();
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
