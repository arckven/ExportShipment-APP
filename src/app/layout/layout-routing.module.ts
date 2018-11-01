import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { CustomsComponent } from './customs/customs.component';
import { FinanceComponent } from './finance/finance.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'shipment', component: ShipmentComponent, canActivate: [AuthGuard] },
      { path: 'customs', component: CustomsComponent, canActivate: [AuthGuard] },
      { path: 'finance', component: FinanceComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
export const LayoutRoutingComponents = [LayoutComponent, DashboardComponent, ShipmentComponent, CustomsComponent, FinanceComponent];
