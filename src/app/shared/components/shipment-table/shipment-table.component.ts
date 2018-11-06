import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-shipment-table',
  templateUrl: './shipment-table.component.html',
  styleUrls: ['./shipment-table.component.sass'],
  providers: [NgbModalConfig, NgbModal]
})
export class ShipmentTableComponent implements OnInit {

  @Input() header: Object;
  @Input() config: Object;
  @Input() customsAddInvoice: Function;
  private container: Object = {};

  @ViewChild('weightControl') weightControl: ElementRef;
  @ViewChild('dimensionControl') dimensionControl: ElementRef;
  @ViewChild('myModal ') myModal: ElementRef;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    public toasterService: ToasterService) {
    // customize default values of modals used by this component tree
    config['backdrop'] = 'static';
    config['centered'] = true;
    config['keyboard'] = false;
    config['size'] = 'lg';
  }

  selectShipment(header, txt) {
    header['customsCollapse'] = false;
    header['financeCollapse'] = false;
    header['shipmentCollapse'] = false;
    header[txt] = true;
  }

  addInvoice(header, obj) {
    this.customsAddInvoice(header, obj);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateContainer(header, container, content) {
    this.container = Object.assign({}, container);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        for (const expShipmentDetails of header['expShipmentDetails']) {
          if (expShipmentDetails['pallet'] && this.container['type'] === 'PALLET') {
            if (expShipmentDetails['pallet']['reference'] === this.container['reference']
              && expShipmentDetails['pallet']['type'] === this.container['type']) {
              expShipmentDetails['pallet']['dimension'] = this.container['dimension'];
              expShipmentDetails['pallet']['weight'] = this.container['weight'];
              expShipmentDetails['pallet']['updated'] = true;
            }
          } else if (expShipmentDetails['carton'] && container['type'] === 'CARTON') {
            if (expShipmentDetails['carton']['reference'] === container['reference']
              && expShipmentDetails['carton']['type'] === container['type']) {
              expShipmentDetails['carton']['dimension'] = this.container['dimension'];
              expShipmentDetails['carton']['weight'] = this.container['weight'];
              expShipmentDetails['carton']['updated'] = true;
            }
          }
        }
        this.toasterService.pop('success', this.container['reference'], 'Changes where made');
      }, (reason) => {
        this.toasterService.pop('warning', this.container['reference'], 'No changes where made');
        console.log('cancel');
      });
    setTimeout(() => {
      if (this.weightControl !== undefined) {
        this.weightControl.nativeElement.focus();
      }
    }, 500);

    // if (header['status'] === 'NEW') {
    //   this.modalService1.openDialog(this.viewRef, {
    //     title: 'Update ' + container['type'].toLowerCase() + ' ' + container.reference + ' information',
    //     childComponent: SimpleModalComponent,
    //     data: container,
    //     settings: {},
    //     actionButtons: [
    //       {
    //         text: 'Cancel',
    //         buttonClass: 'btn btn-danger',
    //         onAction: () => new Promise((resolve: any, reject: any) => {
    //           console.log('canceled');
    //           resolve();
    //         })
    //       },
    //       {
    //         text: 'Save ' + container['type'].toLowerCase() + ' Information',
    //         buttonClass: 'btn btn-primary',
    //         onAction: () => new Promise((resolve: any) => {
    //           console.log('saved');


    //           for (const expShipmentDetails of header['expShipmentDetails']) {
    //             if (expShipmentDetails['pallet'] && container['type'] === 'PALLET') {
    //               if (expShipmentDetails['pallet']['containerId'] === container['containerId']
    //                 && expShipmentDetails['pallet']['type'] === container['type']) {
    //                 expShipmentDetails['pallet'] = container;
    //                 expShipmentDetails['pallet']['updated'] = true;
    //               }
    //             } else if (expShipmentDetails['carton'] && container['type'] === 'CARTON') {
    //               if (expShipmentDetails['carton']['containerId'] === container['containerId']
    //                 && expShipmentDetails['carton']['type'] === container['type']) {
    //                 expShipmentDetails['carton'] = container;
    //                 expShipmentDetails['carton']['updated'] = true;
    //               }
    //             }
    //           }

    //           resolve();
    //         })
    //       }
    //     ]
    //   });
    // } else {
    //   console.log('error');
    //   this.toasterService.pop('warning', 'Shipment ['
    //     + header['shipmentHeaderId'] + '] can not be updated with status of ' + header['status']);
    // }
  }

  ngOnInit() {
  }

}
