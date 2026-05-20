import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DollarServiceTsService } from 'src/app/core/services/dollar/dollar.service.ts.service';
import { DolarPrice } from '../../interfaces/dolarPrice.interface';

@Component({
  selector: 'shared-dollar-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-dollar-box.component.html',
  styleUrls: ['./shared-dollar-box.component.scss']
})
export class SharedDollarBoxComponent implements OnInit {

  public titlte: string = 'Precio del dolar';
  public dolarPriceUpdated: DolarPrice = {
    compra: 0,
    venta: 0,
    fechaActualizacion: ''
  };
  

  constructor(private dollarService: DollarServiceTsService) { }

  ngOnInit(): void {
    this.getDollarPrice();
  }

  getDollarPrice(){
    this.dollarService.getDollarRate().subscribe(data => {
      this.dolarPriceUpdated = data;
    });
  }
}
