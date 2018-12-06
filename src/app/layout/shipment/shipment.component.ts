import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../shared/animations/router.animations';
import { style, animate, transition, trigger } from '@angular/animations';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.sass'],
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
export class ShipmentComponent implements OnInit {

  childSearch: Object = { status: 'NEW' };
  config: Object = {
    shipmentCollapse: true, customsCollapse: false, financeCollapse: false,
    addCustomsInvoice: false, addFinanceInvoice: false, showPalletBtn: true,
    showFlatFileButton: false,
    showCartonBtn: true,
    statusToSave: 'SHIPMENT',
    statusToValidate: 'NEW'
  };

  constructor(public toasterService: ToasterService) {


  }


  ngOnInit() {
    this.toasterService.clear();
  }

}
