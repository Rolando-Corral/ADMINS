import { Injectable } from '@angular/core';
import { AssetModelTs } from '../../interfaces/asset.model.ts.js';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private assets: AssetModelTs[] = [
    { id: '1', name: 'Galicia', currency: 'ARS', amount: 3455072.52, category: 'cuenta remunerada' },
    { id: '2', name: 'Galicia', currency: 'USD', amount: 300.09, category: 'plazo fijo en USD' },
    { id: '3', name: 'ARQ', currency: 'ARS', amount: 166505.83, category: 'cuenta remunerada' },
    { id: '4', name: 'APPL', currency: 'USD', amount: 21.21, category: 'posición' },
    { id: '5', name: 'MSFT', currency: 'USD', amount: 11.32, category: 'posición' },
    { id: '6', name: 'AMZN', currency: 'USD', amount: 11.29, category: 'posición' },
    { id: '7', name: 'SPY', currency: 'USD', amount: 7.35, category: 'posición' },
    { id: '8', name: 'KO', currency: 'USD', amount: 4.64, category: 'posición' },
    { id: '9', name: 'NDAQ', currency: 'USD', amount: 10.20, category: 'posición' },
  ];

  getAssets():  AssetModelTs[] {
    return this.assets;
  }
}