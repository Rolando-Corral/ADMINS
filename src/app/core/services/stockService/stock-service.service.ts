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
  private cacheDuration = 30 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getPrice(symbol: string): Observable<number | null> {
    const cached = this.getFromCache(symbol);

    if (cached && !this.isExpired(cached.timestamp)) {
      console.log(`Cache hit: ${symbol} = $${cached.price}`);
      return of(cached.price);
    }

    const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response['Error Message']) {
          console.error(`[StockService] Error API para ${symbol}:`, response['Error Message']);
          return null;
        }

        if (response['Note']) {
          console.warn(`[StockService] Límite API para ${symbol}:`, response['Note']);
          return null;
        }

        const quote = response['Global Quote'];
        const priceStr = quote?.['05. price'];

        if (priceStr) {
          const price = Number(priceStr);
          this.saveToCache(symbol, price);
          return price;
        }

        console.warn(`[StockService] Sin precio disponible para ${symbol}`);
        return null;
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
