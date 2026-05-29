import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraphicsComponent } from '../graphics/graphics/graphics.component';
import { SharesTableComponent } from '../shares-table/shares-table.component';
import { PiechartsComponent } from '../graphics/piecharts/piecharts.component';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    GraphicsComponent,
    SharesTableComponent,
    PiechartsComponent
  ]
})
export class DashboardModule { }
