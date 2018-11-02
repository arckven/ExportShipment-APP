import { Component, OnInit, ViewChild, ElementRef, Directive, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../shared/animations/router.animations';
import { style, animate, transition, trigger } from '@angular/animations';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { ShipmentModalComponent } from './shipment-modal/shipment-modal.component';
import { ToasterService } from 'angular2-toaster';
import { ShipmentService } from '../../shared/services/export-shipment/shipment.service';

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
    showCartonBtn: true
  };

  constructor(private modalService: ModalDialogService,
    private viewRef: ViewContainerRef, public toasterService: ToasterService, public shipment: ShipmentService) {


  }




  toggle(value): boolean {
    this.toasterService.clear();
    if (value === undefined || value === false) {
      for (const shipments of this.childSearch['result']) {
        for (const expShipmentDetails of shipments['expShipmentDetails']) {
          expShipmentDetails.collapsed = false;
        }
      }
      value = true;
    } else {
      value = false;
    }
    return value;
  }


  selectAll(value): void {
    console.log(value);
    if (value === undefined) {
      value = true;
    }
    for (const shipments of this.childSearch['result']) {
      shipments['selected'] = value;
    }
  }

  closeShipment(shipment): void {
    console.log('Close Shipment', shipment);
    if (this.ShipmentEditable(shipment)) {
      shipment['status'] = 'SHIPMENT';
      for (const details of shipment['expShipmentDetails']) {
        if (details['status'] === 'NEW') {
          details['status'] = 'SHIPMENT';
        }
      }


      this.shipment.updateShipment([shipment]).subscribe(
        data => {
          console.log(data);
          this.toasterService.pop(String(data['status']).toLowerCase(), data['detail']);
        },
        err => {
          console.log(err);
          this.toasterService.pop('error', err.status + ' - ' + err.message);
        }
      );
    }
  }

  ShipmentEditable(shipment): boolean {
    this.toasterService.clear();
    if (shipment['status'] !== 'NEW') {
      this.toasterService.pop('warning', 'Shipment ['
        + shipment['shipmentHeaderId'] + '] can not be updated with status of ' + shipment['status']);
      return false;
    } else {
      return true;
    }
  }

  confirmCloseShipment(shipment) {
    if (this.ShipmentEditable(shipment)) {
      this.modalService.openDialog(this.viewRef, {
        title: 'Close Shipment ',
        childComponent: SimpleModalComponent,
        data: {
          text: 'Do you want to close this shipment?'
        },
        settings: {},
        actionButtons: [
          {
            text: 'Cancel',
            buttonClass: 'btn btn-danger',
            onAction: () => new Promise((resolve: any, reject: any) => {
              console.log('canceled');
              resolve();
            })
          },
          {
            text: 'Close Shipment',
            buttonClass: 'btn btn-success',
            onAction: () => new Promise((resolve: any) => {
              console.log('saved');
              this.closeShipment(shipment);
              resolve();
            })
          }
        ]
      });
    } else {
      console.log('open', shipment['header']);
      this.toasterService.clear();
      if (shipment['status'] === 'SHIPMENT') {
        this.modalService.openDialog(this.viewRef, {
          title: 'Open Shipment ',
          childComponent: SimpleModalComponent,
          data: {
            text: 'Do you want to open this shipment?'
          },
          settings: {},
          actionButtons: [
            {
              text: 'Cancel',
              buttonClass: 'btn btn-danger',
              onAction: () => new Promise((resolve: any, reject: any) => {
                console.log('canceled');
                resolve();
              })
            },
            {
              text: 'Open Shipment',
              buttonClass: 'btn btn-success',
              onAction: () => new Promise((resolve: any) => {
                console.log('saved');
                shipment['status'] = 'NEW';
                for (const details of shipment['expShipmentDetails']) {
                  if (details['status'] === 'SHIPMENT') {
                    details['status'] = 'NEW';
                  }
                }
                this.toasterService.pop('success', 'Shipment [' + shipment['shipmentHeaderId'] + '] can be updated');
                resolve();
              })
            }
          ]
        });
      }
    }
  }


  ngOnInit() {
    this.toasterService.clear();
  }

}
