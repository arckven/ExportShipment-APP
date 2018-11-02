import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { ShipmentService } from '../../services/export-shipment/shipment.service';
// import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-shipment-table',
  templateUrl: './shipment-table.component.html',
  styleUrls: ['./shipment-table.component.sass']
})
export class ShipmentTableComponent implements OnInit {

  @Input() header: Object;
  @Input() config: Object;
  @Input() customsAddInvoice: Function;

  constructor(private modalService: ModalDialogService,
    private viewRef: ViewContainerRef, public toasterService: ToasterService, public shipment: ShipmentService) { }

  selectShipment(header, txt) {
    header['customsCollapse'] = false;
    header['financeCollapse'] = false;
    header['shipmentCollapse'] = false;
    header[txt] = true;
  }

  addInvoice(header, obj) {
    this.customsAddInvoice(header, obj);
  }


  updateContainer(header, container) {
    this.toasterService.clear();
    if (header['status'] === 'NEW') {
      this.modalService.openDialog(this.viewRef, {
        title: 'Update ' + container['type'].toLowerCase() + ' ' + container.reference + ' information',
        childComponent: SimpleModalComponent,
        data: container,
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
            text: 'Save ' + container['type'].toLowerCase() + ' Information',
            buttonClass: 'btn btn-primary',
            onAction: () => new Promise((resolve: any) => {
              console.log('saved');


              for (const expShipmentDetails of header['expShipmentDetails']) {
                if (expShipmentDetails['pallet'] && container['type'] === 'PALLET') {
                  if (expShipmentDetails['pallet']['containerId'] === container['containerId']
                    && expShipmentDetails['pallet']['type'] === container['type']) {
                    expShipmentDetails['pallet'] = container;
                    expShipmentDetails['pallet']['updated'] = true;
                  }
                } else if (expShipmentDetails['carton'] && container['type'] === 'CARTON') {
                  if (expShipmentDetails['carton']['containerId'] === container['containerId']
                    && expShipmentDetails['carton']['type'] === container['type']) {
                    expShipmentDetails['carton'] = container;
                    expShipmentDetails['carton']['updated'] = true;
                  }
                }
              }

              resolve();
            })
          }
        ]
      });
    } else {
      console.log('error');
      this.toasterService.pop('warning', 'Shipment ['
        + header['shipmentHeaderId'] + '] can not be updated with status of ' + header['status']);
    }
  }

  ngOnInit() {
  }

}
