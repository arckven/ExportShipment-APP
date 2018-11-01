import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutRoutingModule, LayoutRoutingComponents } from './layout-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTachometerAlt, faTruckLoading, faShippingFast, faFileInvoiceDollar,
  faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faBars, faTruckMoving, faUser
} from '@fortawesome/free-solid-svg-icons';

import { CustomsComponent } from './customs/customs.component';
import { FinanceComponent } from './finance/finance.component';

import { PageHeaderModule } from '../shared/modules/page-header/page-header.module';

// Add an icon to the library for convenient access in other components
library.add(faTachometerAlt, faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faTruckLoading, faShippingFast, faFileInvoiceDollar, faBars, faTruckMoving, faUser);

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    Ng2Charts,
    PageHeaderModule,
    FontAwesomeModule
  ],
  declarations: [LayoutRoutingComponents, SidebarComponent, HeaderComponent, CustomsComponent, FinanceComponent]
})
export class LayoutModule { }
