import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CachedPrice {
  price: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class StockService {

  private apiKey = environment.alphaVantageApiKey;
  private baseUrl = 'https://www.alphavantage.co/query';
  private cacheDuration = 30 * 60 * 1000; // 30 minutos en milisegundos

  constructor(private http: HttpClient) {}

  getPrice(symbol: string): Observable<number> {
    const cached = this.getFromCache(symbol);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      console.log(`Cache hit: ${symbol} = $${cached.price} (${Math.round((Date.now() - cached.timestamp)/1000)}s ago)`);
      return of(cached.price);
    }

    console.log(`Cache miss: ${symbol} - consultando API...`);
    const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log(`Respuesta API para ${symbol}:`, response);
        
        if (response['Error Message']) {
          throw new Error(response['Error Message']);
        }
        
        if (response['Note']) {
          throw new Error('Límite de API alcanzado: ' + response['Note']);
        }
        
        const quote = response['Global Quote'];
        if (quote && quote['05. price']) {
          const price = Number(quote['05. price']);
          this.saveToCache(symbol, price);
          return price;
        }
        throw new Error('Precio no encontrado en la respuesta');
      })
    );
  }

  private getFromCache(symbol: string): CachedPrice | null {
    const data = localStorage.getItem(`stock_${symbol}`);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  private saveToCache(symbol: string, price: number): void {
    const cached: CachedPrice = {
      price: price,
      timestamp: Date.now()
    };
    localStorage.setItem(`stock_${symbol}`, JSON.stringify(cached));
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheDuration;
  }
}
