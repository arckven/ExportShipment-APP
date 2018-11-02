import { Component, OnInit, ViewChild, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ShipmentService } from '../../services/export-shipment/shipment.service';
import { SapService } from '../../services/sap/sap.service';
import { UtilsService } from '../../services/export-shipment/utils.service';
import { SapModalComponent } from './sap-modal/sap-modal.component';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { reject } from 'q';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  @ViewChild('plantControl') plantControl: ElementRef;
  @ViewChild('criteriaControl') criteriaControl: ElementRef;
  @ViewChild('valueControl') valueControl: ElementRef;
  @ViewChild('formControl') formControl: ElementRef;



  @Input() search: Object;
  showSearch = true;

  constructor(public toasterService: ToasterService, public sapService: SapService,
    public utilsService: UtilsService,
    public shipmentService: ShipmentService, private modalService: ModalDialogService,
    private viewRef: ViewContainerRef, ) {

  }


  onChange(tag, value) {
    this.search[tag] = value;
    if (tag === 'plant') {
      this.criteriaControl.nativeElement.focus();
    } else if (tag === 'criteria') {
      this.valueControl.nativeElement.focus();
    }
  }

  searchShipment() {
    this.search['plant'] = 'WSCC';
    this.search['criteria'] = 'ASN';
    this.search['value'] = 'FOXELP163401A';
    if (this.showSearch === false) {
      this.showSearch = true;
      this.search['plant'] = null;
      this.search['criteria'] = null;
      this.search['value'] = null;
    } else {
      this.search['result'] = [];
      if (this.validateSearch()) {
        this.shipmentService.getShipment(this.search).subscribe(
          data => {
            if (data['success']) {
              let requiereSapInformation = false;
              for (const shipment of data['result']) {
                if (this.search['status'] !== shipment['status']) {
                  this.toasterService.pop('warning', 'shipment [' + shipment['shipmentHeaderId'] + '] status [' + shipment['status'] +
                    '] is not valid, must be [' + this.search['status'] + ']');
                  delete data['result'][shipment];
                } else if (shipment['externalSystem'] !== 'CAPTARIS' && shipment['status'] === 'NEW') {
                  // validate if sap information is requiered
                  for (const detail of shipment['expShipmentDetails']) {
                    if (detail['salesOrder'] === null || detail['delivery'] === null) {
                      requiereSapInformation = true;
                      break;
                    }
                  }
                }
                shipment['expShipmentDetails'].sort((obj1, obj2) => {
                  if (obj1['pallet']['reference'] === obj2['pallet']['reference']) {
                    return 1;
                  } else {
                    return -1;
                  }
                });
              }

              // fill sales order and delivery to call sap transaction
              if (requiereSapInformation) {
                this.openSapModal(data['result']);
              }
              this.search['result'] = data['result'];
              this.RetrieveFinances(this.search['result']);
              this.showSearch = false;
            } else {
              const status = String(data['status']).toLowerCase();
              this.toasterService.pop(status, 'No shipment information');
            }
          },
          err => {
            this.toasterService.pop('error', err.status + ' - ' + err.message);
          }
        );
      }
    }
  }

  RetrieveFinances(shipmentLst) {
    shipmentLst.forEach(shipment => {
      shipment['expShipmentDetailsFinance'] = [];
      shipment['expShipmentDetails'].forEach(detail => {
        detail['expShipmentFinances'].forEach(finance => {
          finance['salesOrder'] = detail['salesOrder'];
          finance['delivery'] = detail['delivery'];
          let isFound = false;
          shipment['expShipmentDetailsFinance'].forEach(obj => {
            if (obj['salesOrder'] === finance['salesOrder'] &&
              obj['delivery'] === finance['delivery'] &&
              obj['finInvDate'] === finance['finInvDate'] &&
              obj['finInvoice'] === finance['finInvoice'] &&
              obj['status'] === finance['status'] &&
              obj['uuid'] === finance['uuid']) {
              isFound = true;
            }
          });
          if (!isFound) {
            shipment['expShipmentDetailsFinance'].push(finance);
          }

        });
      });
    });
  }


  resetValue() {
    this.valueControl.nativeElement.select();
  }

  clearSearch() {
    this.toasterService.clear();
    this.search['result'] = [];
    this.showSearch = true;
    this.search['plant'] = null;
    this.search['criteria'] = null;
    this.search['value'] = null;
    this.formControl.nativeElement.reset();
    setTimeout(() => {
      this.plantControl.nativeElement.focus();
    }, 500);
  }

  validateSearch(): boolean {
    this.toasterService.clear();
    if (this.search['plant'] === undefined) {
      this.toasterService.pop('warning', 'please, select a plant');
      setTimeout(() => {
        this.plantControl.nativeElement.focus();
      }, 500);
    } else if (this.search['criteria'] === undefined) {
      this.toasterService.pop('warning', 'please, select a criteria');
      setTimeout(() => {
        this.criteriaControl.nativeElement.focus();
      }, 500);
    } else if (this.search['value'] === undefined || this.search['value'] === '') {
      this.toasterService.pop('warning', 'please, enter a value');
      setTimeout(() => {
        this.valueControl.nativeElement.focus();
      }, 500);
    } else {
      return true;
    }
    return false;
  }


  openSapModal(shipmentLst) {
    this.toasterService.clear();
    shipmentLst.forEach(shipment => {
      if (shipment['status'] !== 'NEW') {
        const findData: Object = { plant: shipment['plant'], delivery: undefined, salesOrder: undefined };
        this.modalService.openDialog(this.viewRef, {
          title: 'Please complete the following information ',
          childComponent: SapModalComponent,
          data: findData,
          settings: {},
          actionButtons: [
            {
              text: 'Cancel',
              buttonClass: 'btn btn-danger',
              onAction: () => new Promise((resolve: any) => {
                this.clearSearch();
                resolve();
              })
            },
            {
              text: 'Update ',
              buttonClass: 'btn btn-primary',
              onAction: () => new Promise((resolve: any, reject: any) => {
                this.toasterService.clear();
                if (!findData['salesOrder']) {
                  this.toasterService.pop('warning', 'Please enter a sales order value');
                  reject();
                } else if (!findData['delivery']) {
                  this.toasterService.pop('warning', 'Please enter a delivery value');
                  reject();
                } else {

                  this.sapService.retriveZMX_SAP_ZOE(shipment.plant, findData['salesOrder'], findData['delivery']).subscribe(
                    data => {
                      if (data['exports']['SUCCESS'] === 'S') {
                        const respList = data['tables']['ITAB'];
                        if (respList) {
                          for (const resp of data['tables']['ITAB']) {
                            shipment['incoterm'] = resp['INCO1'];
                            shipment['customer'] = resp['KUNNRSOLD'];
                            shipment['shipto'] = resp['KUNNRSHIP'];
                            for (const detail of shipment['expShipmentDetails']) {
                              if (detail['materialId'] === resp['MATNR']) {
                                detail['salesOrder'] = resp['VBELN'];
                                detail['deliveryLine'] = resp['POSNRDEL'];
                                detail['salesOrderLine'] = resp['POSNR'];
                              }
                            }
                          }
                          resolve();
                        } else {
                          reject();
                          this.toasterService.pop('error', 'Cannnot Retrieve SAP information');
                        }
                      } else {
                        reject();
                        this.toasterService.pop('error', data['exports']['ERROR_MSG']);
                      }
                    },
                    err => {
                      this.toasterService.pop('error', err.status + ' - ' + err.message);
                      reject();
                    });

                }
              })
            }
          ]
        });
      }
    });
  }

  ngOnInit() {
    this.utilsService.getConfiguration('SEARCH_CONTROL').subscribe(
      data => {
        if (data['success']) {
          this.search['Plant'] = data['result']['Plant'];
          this.search['Criteria'] = data['result']['Criteria'];
        }
      },
      err => {
        this.toasterService.pop('error', err.status + ' - ' + err.message);
      });
    setTimeout(() => {
      this.plantControl.nativeElement.focus();
    }, 500);
  }

}
