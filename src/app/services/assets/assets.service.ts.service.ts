import { Injectable } from '@angular/core';
import { AssetModelTs } from '../../interfaces/asset.model.ts.js';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private assets: AssetModelTs[] = [
    { id: '1', countName: 'Galicia', currency: 'ARS', acquisitionCostUsd: 3455072.52, category: 'cuenta remunerada' },
    { id: '2', countName: 'Galicia', currency: 'USD', acquisitionCostUsd: 300.09, category: 'plazo fijo en USD' },
    { id: '3', countName: 'ARQ', currency: 'ARS', acquisitionCostUsd: 166775.85,currentValueUsd: 0, category: 'cuenta remunerada' },
    { id: '4', countName: 'AAPL', currency: 'USD', acquisitionCostUsd: 20.01,currentValueUsd: 21.28, category: 'posición' },
    { id: '5', countName: 'MSFT', currency: 'USD', acquisitionCostUsd: 10,currentValueUsd: 11.36, category: 'posición' },
    { id: '6', countName: 'AMZN', currency: 'USD', acquisitionCostUsd: 10,currentValueUsd: 11.89, category: 'posición' },
    { id: '7', countName: 'SPY', currency: 'USD', acquisitionCostUsd: 17.91,currentValueUsd: 18.56, category: 'posición' },
    { id: '8', countName: 'KO', currency: 'USD', acquisitionCostUsd: 4.74,currentValueUsd: 4.69, category: 'posición' },
    { id: '9', countName: 'NDAQ', currency: 'USD', acquisitionCostUsd: 10.20,currentValueUsd: 10.33, category: 'posición' },
    { id: '10', countName: 'NVDA', currency: 'USD', acquisitionCostUsd: 20,currentValueUsd: 20.78, category: 'posición' },
  ];

  getAssets():  AssetModelTs[] {
    return this.assets;
  }
}