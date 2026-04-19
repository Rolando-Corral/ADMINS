import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DollarServiceTsService {

  //   {
//     "moneda": "USD",
//     "casa": "oficial",
//     "nombre": "Oficial",
//     "compra": 1340,
//     "venta": 1390,
//     "fechaActualizacion": "2026-04-17T17:00:00.000Z"
// }
  
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


