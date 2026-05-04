import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdaterComponent } from '../updater/updater/updater.component';
import { SharesTableComponent } from '../shares-table/shares-table.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'updater',
        component: UpdaterComponent
      },
      {
        path: 'shares-table',
        component: SharesTableComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
