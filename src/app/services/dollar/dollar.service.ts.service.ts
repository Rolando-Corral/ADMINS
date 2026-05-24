import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DollarServiceTsService {
  
  private baseUrl = 'https://dolarapi.com/v1/dolares/oficial';

  constructor() { }

  getDollarRate(): Observable<{ compra: number; venta: number; fechaActualizacion: string; }> {
    return new Observable(observer => {
      fetch(this.baseUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          observer.next({
            compra: data.compra,
            venta: data.venta,
            fechaActualizacion: data.fechaActualizacion
          });
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
 
 }


