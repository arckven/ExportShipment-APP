import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { routerTransition } from '../../shared/animations/router.animations';



@Component({
  selector: 'app-customs',
  templateUrl: './customs.component.html',
  styleUrls: ['./customs.component.sass'],
  animations: [routerTransition(), trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({ opacity: 0 }),
      animate(300, style({ opacity: 1, height: '*' }))
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate(300, style({ opacity: 0, height: '0' }))
    ])
  ])]
})
export class CustomsComponent implements OnInit {

  childSearch: Object = { status: 'SHIPMENT' };

  config: Object = {
    shipmentCollapse: false, customsCollapse: true, financeCollapse: false,
    addCustomsInvoice: true, addFinanceInvoice: false, showPalletBtn: false,
    showFlatFileButton: true,
    showCartonBtn: false,
    statusToSave: 'CUSTOMS',
    statusToValidate: 'SHIPMENT'
  };

  constructor(public toasterService: ToasterService) {

  }



















  validateCustoms(customs): boolean {
    if (!customs['carrier']) {
      this.toasterService.pop('warning', 'Carrier is missing');
      return false;
    }

    if (!customs['tracking']) {
      this.toasterService.pop('warning', 'Tracking is missing');
      return false;
    }

    if (!customs['customsInvoice']) {
      this.toasterService.pop('warning', 'Invoice number is missing');
      return false;
    }

    if (!customs['plate']) {
      this.toasterService.pop('warning', 'Plate is missing');
      return false;
    }

    if (!customs['seal']) {
      this.toasterService.pop('warning', 'Seal is missing');
      return false;
    }
    if (!customs['transportType']) {
      this.toasterService.pop('warning', 'Transport Type is missing');
      return false;
    }
    if (!customs['incoterm']) {
      this.toasterService.pop('warning', 'incoterm is missing');
      return false;
    }
    if (!customs['pediment']) {
      this.toasterService.pop('warning', 'Pediment is missing');
      return false;
    }
    if (!customs['date']) {
      this.toasterService.pop('warning', 'Date is missing');
      return false;
    }

    return true;
  }




  ngOnInit() {
    this.toasterService.clear();
  }

}
