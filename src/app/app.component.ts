import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { DollarServiceTsService } from './services/dollar/dollar.service.ts.service';
import { HeaderConfig } from './shared/interfaces/header.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  valores: number[] = [];
  fechaActualizacion: string = '';
  headerConfig: HeaderConfig = {
    title: 'ADMIN$'
  };

  constructor(private dollarService: DollarServiceTsService) { }

  ngOnInit() {
    this.showDollarRate();
  }
  showDollarRate() {
    this.dollarService.getDollarRate().subscribe(data => {
      this.valores = [data.compra, data.venta];
      this.fechaActualizacion = data.fechaActualizacion;
    });
  }

}
