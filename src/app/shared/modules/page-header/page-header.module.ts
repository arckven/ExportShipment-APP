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
import { ModalDialogModule } from 'ngx-modal-dialog';
import { BlockUIModule } from 'ng-block-ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  faTachometerAlt, faTruckLoading, faShippingFast, faFileInvoiceDollar,
  faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faBars, faTruckMoving, faUser, faCheck, faEdit
} from '@fortawesome/free-solid-svg-icons';

// Add an icon to the library for convenient access in other components
library.add(faTachometerAlt, faUsersCog, faArrowRight, faAngleDoubleLeft, faAngleDoubleRight,
  faTruckLoading, faShippingFast, faFileInvoiceDollar, faBars, faTruckMoving, faUser, faCheck,
  faEdit);



@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot(),
    RouterModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, ModalDialogModule, BlockUIModule.forRoot()
  ],
  declarations: [PageHeaderComponent, SearchComponent, ShipmentTableComponent, SapModalComponent],
  exports: [PageHeaderComponent, SearchComponent, ShipmentTableComponent, SapModalComponent],
  entryComponents: [SapModalComponent]
})
export class PageHeaderModule { }
