import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from './page-header.component';
import { SearchComponent } from '../../components/search/search.component';
import { ShipmentTableComponent } from '../../components/shipment-table/shipment-table.component';
import { SapModalComponent } from '../../components/search/sap-modal/sap-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTachometerAlt, faTruckLoading, faShippingFast, faFileInvoiceDollar,
  faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faBars, faTruckMoving, faUser
} from '@fortawesome/free-solid-svg-icons';

// Add an icon to the library for convenient access in other components
library.add(faTachometerAlt, faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faTruckLoading, faShippingFast, faFileInvoiceDollar, faBars, faTruckMoving, faUser);



@NgModule({
  imports: [
    CommonModule,
    RouterModule, FormsModule, ReactiveFormsModule, FontAwesomeModule
  ],
  declarations: [PageHeaderComponent, SearchComponent, SapModalComponent, ShipmentTableComponent],
  exports: [PageHeaderComponent, SearchComponent, SapModalComponent, ShipmentTableComponent],
  entryComponents: [SapModalComponent]
})
export class PageHeaderModule { }
