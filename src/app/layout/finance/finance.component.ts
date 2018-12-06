import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../shared/animations/router.animations';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.sass'],
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
export class FinanceComponent implements OnInit {

  childSearch: Object = { status: 'CUSTOMS' };

  config: Object = {
    shipmentCollapse: false, customsCollapse: false, financeCollapse: true,
    addCustomsInvoice: false, addFinanceInvoice: true, showPalletBtn: false,
    showFlatFileButton: false,
    showCartonBtn: false,
    statusToSave: 'CUSTOMS',
    statusToValidate: 'CUSTOMS'
  };

  constructor() { }

  ngOnInit() {
  }

}
