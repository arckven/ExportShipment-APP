import { Component, OnInit, Input, ViewChild, ElementRef, ViewContainerRef, Renderer2 } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ShipmentService } from '../../services/export-shipment/shipment.service';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

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
      public container: Object = {};
      public customInvoice: Object = {};
      public financeInvoice: Object = {};
      customsLength = {
            carrier: 35, tracking: 22, invoice: 22, plate: 10, seal: 10, transport: 20, incoterm: 3, pediment: 22
      };
      financeLength = {
            finInvoice: 22, uuid: 40
      };

      @ViewChild('weightControl') weightControl: ElementRef;
      @ViewChild('dimensionControl') dimensionControl: ElementRef;
      @ViewChild('myModal ') myModal: ElementRef;

      constructor(public shipmentService: ShipmentService, config: NgbModalConfig, private modalService: NgbModal,
            private renderer: Renderer2,
            public toasterService: ToasterService, private modalDialogService: ModalDialogService, private viewRef: ViewContainerRef) {
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

      // addInvoice(header, obj) {
      //       this.customsAddInvoice(header, obj);
      // }

      open(content) {
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                  console.log(`Closed with:$ {result}`);
            }, (reason) => {
                  console.log(`Dismissed $ {this.getDismissReason(reason)}`);
            });
      }

      private getDismissReason(reason: any): string {
            if (reason === ModalDismissReasons.ESC) {
                  return 'by pressing ESC';
            } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                  return 'by clicking on a backdrop';
            } else {
                  return `with:$ {reason}`;
            }
      }

      updateContainer(header, container, content) {
            this.container = Object.assign({}, container);
            this.toasterService.clear();
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
            const inputElement = this.renderer.selectRootElement('#weightControl');
            inputElement.focus();
      }

      addInvoice(header, data, content): void {
            console.log(content['_def']['references']);
            this.toasterService.clear();
            let actualDate: NgbDate;


            if (data) {
                  const tmpdate = new Date(data['invoiceDate']);
                  actualDate = new NgbDate(tmpdate.getFullYear(), tmpdate.getMonth() + 1, tmpdate.getDate());
                  data['status'] = 'UPDATE';

                  if (content['_def']['references']['financeModal']) {
                        data['date'] = actualDate;
                  } else if (content['_def']['references']['CustomsModal']) {
                        data['date'] = actualDate;
                        data['carrier'] = header['carrier'];
                        data['tracking'] = header['tracking'];
                        data['plate'] = header['plate'];
                        data['seal'] = header['seal'];
                        data['transportType'] = header['transportType'];
                        data['incoterm'] = header['incoterm'];
                  }
            } else {
                  const displayDate = new Date();
                  actualDate = new NgbDate(displayDate.getFullYear(), displayDate.getMonth() + 1, displayDate.getDate());
                  data = { status: 'NEW', date: actualDate };
            }



            this.modalService.open(content, {
                  ariaLabelledBy: 'modal-basic-title'
            }).result
                  .then((result) => {
                        if (content['_def']['references']['financeModal']) {


                              this.toasterService.pop('success', this.container['reference'], 'Changes where made');
                              if (data['status'] === 'NEW') {
                                    console.log('satus NEW');
                                    for (const detail of header['expShipmentDetails']) {
                                          if (detail['delivery'] === this.financeInvoice['delivery'] &&
                                                detail['salesOrder'] === this.financeInvoice['salesOrder']) {
                                                detail['expShipmentFinances'].push(this.financeInvoice);
                                          }
                                    }
                              }
                              this.financeInvoice['finInvDate'] = new Date(this.financeInvoice['date']['year'],
                                    this.financeInvoice['date']['month'] - 1, this.financeInvoice['date']['day']).getTime();

                              this.RetrieveFinances([header]);

                        } else if (content['_def']['references']['CustomsModal']) {
                              header['carrier'] = this.customInvoice['carrier'];
                              header['tracking'] = this.customInvoice['tracking'];
                              data['customsInvoice'] = this.customInvoice['customsInvoice'];
                              header['plate'] = this.customInvoice['plate'];
                              header['seal'] = this.customInvoice['seal'];
                              header['transportType'] = this.customInvoice['transportType'];
                              header['incoterm'] = this.customInvoice['incoterm'];
                              data['pediment'] = this.customInvoice['pediment'];
                              data['invoiceDate'] = new Date(this.customInvoice['date']['year'],
                                    this.customInvoice['date']['month'] - 1, this.customInvoice['date']['day']).getTime();
                              this.toasterService.pop('success', this.container['reference'], 'Changes where made');
                              if (data['status'] === 'NEW') {
                                    header['expShipmentCustoms'].push(data);
                              }
                        }
                        console.log(header);
                  }, (reason) => {
                        this.toasterService.pop('warning', this.container['reference'], 'No changes where made');
                        console.log('cancel');
                  });

            if (content['_def']['references']['financeModal']) {

                  // prepare data
                  let detail = [];
                  let delivery = [];

                  header['expShipmentDetails'].forEach(detailTmp => {
                        detail.push(detailTmp['salesOrder']);
                        delivery.push(detailTmp['delivery']);
                  });
                  // remove duplicates
                  detail = detail.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                  });
                  delivery = delivery.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                  });


                  if (detail.length === 1) {
                        data['salesOrder'] = detail[0];
                  }
                  if (delivery.length === 1) {
                        data['delivery'] = delivery[0];
                  }

                  data['salesOrderLst'] = detail;
                  data['deliveryLst'] = delivery;


                  const inputElement = this.renderer.selectRootElement('#invoiceCtrl');
                  inputElement.focus();
                  this.financeInvoice = Object.assign({}, data);
                  console.log(this.financeInvoice);
            } else {
                  const inputElement = this.renderer.selectRootElement('#carrierCtrl');
                  inputElement.focus();
                  this.customInvoice = Object.assign({}, data);
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

      closeShipment(header) {
            this.toasterService.clear();
            if (this.ShipmentEditable(header)) {
                  this.modalDialogService.openDialog(this.viewRef, {
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
                                          this.changeShipmentStatus(header);
                                          console.log('save ', header);
                                          this.shipmentService.updateShipment([header]).subscribe(
                                                data => {
                                                      console.log(data);
                                                      this.toasterService.pop(String(data['status']).toLowerCase(), data['detail']);
                                                },
                                                err => {
                                                      console.log(err);
                                                      this.toasterService.pop('error', err.status + ' - ' + err.message);
                                                }
                                          );
                                          resolve();
                                    })
                              }
                        ]
                  });



            }
            // this.toasterService.pop('success', 'Update shipment' + header['shipmentHeaderId'], 'saved');
      }

      ShipmentEditable(header): boolean {
            this.toasterService.clear();
            if (header['status'] !== this.config['statusToValidate']) {
                  this.toasterService.pop('warning', 'Update shipment', 'Shipment [' +
                        header['shipmentHeaderId'] + '] can not be updated with status of ' +
                        header['status'] + ' must be ' + this.config['statusToValidate']);
                  return false;
            } else {
                  return true;
            }
      }

      changeShipmentStatus(header): void {
            header['status'] = this.config['statusToSave'];
            for (const details of header['expShipmentDetails']) {
                  if (details['status'] === this.config['statusToValidate']) {
                        details['status'] = this.config['statusToSave'];
                  }
            }
      }

      // download flat file

      downloadShipmentFlatFile(header): void {
            this.prepareFlatFile(header)
                  .subscribe(res => {

                        let fileName = '';
                        const date = new Date();
                        fileName += (String(date.getMonth() + 1).length < 2)
                              ? '0' + String(date.getMonth() + 1)
                              : String(date.getMonth() + 1);
                        fileName += (String(date.getDay() + 1).length < 2)
                              ? '0' + String(date.getDay() + 1)
                              : String(date.getDay() + 1);
                        fileName += String(date.getFullYear());
                        fileName += '.csv';

                        this.dyanmicDownloadByHtmlTag({
                              fileName: fileName,
                              text: res
                        });

                  });
      }

      prepareFlatFile(header) {
            const enter = '\n\r';
            let lines = '';
            let customs = {};
            const summaryLst = [];



            // Summary
            for (const customsTmp of header['expShipmentCustoms']) {
                  customs = customsTmp;
            }
            for (const detail of header['expShipmentDetails']) {

                  // find summary
                  let summary = null;
                  for (const asnTmp of summaryLst) {
                        if (asnTmp['materialId'] === detail['materialId']) {
                              summary = asnTmp;
                              break;
                        }
                  }
                  if (summary === null) {
                        summary = { materialId: detail['materialId'] };
                        summaryLst.push(summary);
                  }

                  const qty = detail['quantity'];
                  if (isNaN(summary['quantity'])) {
                        console.log('summary');
                        summary['quantity'] = 0;
                  }
                  summary['materialId'] = detail['materialId'];
                  summary['quantity'] = summary['quantity'] + qty;
                  summary['date'] = customs['date'];
                  summary['shipTo'] = header['shipTo'];
                  summary['salesOrder'] = detail['salesOrder'];
                  summary['productType'] = 'PT';
                  summary['country'] = 'MX';
                  summary['asn'] = detail['asn'];
                  summary['qtyPallets'] = '1';
                  summary['zoeFinishGood'] = '02';
                  summary['seal'] = header['seal'];
                  summary['sealPlate'] = header['seal'] + header['plate'];
            }

            console.log(summaryLst);
            for (const summary of summaryLst) {
                  lines += this.fillData(summary['materialId'], 22, false);
                  lines += this.fillData(summary['quantity'], 11, false);
                  lines += this.fillDate(summary['date'], 15, false);
                  lines += this.fillData(summary['shipTo'], 17, false);
                  lines += this.fillData(summary['salesOrder'], 18, false);
                  lines += this.fillData(summary['productType'], 9, false);  // product type  PT, MP
                  lines += this.fillData(summary['country'], 4, false);  // country  MX, CN
                  lines += this.fillData(summary['asn'], 16, false);
                  lines += this.fillData(summary['qtyPallets'], 3, false);  // qty of pallets first Part numer
                  lines += this.fillData(summary['zoeFinishGood'], 3, false);  // zoe mapping to finished good
                  lines += this.fillData(summary['seal'], 16, false);  // belt
                  lines += this.fillData(summary['sealPlate'], 22, false);  // belt + trailer number
                  lines += enter;
            }

            return of(lines);
      }

      fillData(str, qty, left): string {
            str = str === undefined ? '' : str;
            if (!left) {
                  str = String(str + '                                                                ')
                        .substr(0, qty);
            } else {
                  str = String('                                                                ' + str)
                        .substr(str.length - qty, str.length);
            }
            return str;
      }

      fillDate(date, qty, left): string {
            let str = '';
            if (date !== undefined) {
                  if (date['day'].length < 2) {
                        str = '0' + date['day'];
                  } else {
                        str = date['day'];
                  }
                  str += '/';
                  if ((date['month'] + 1).length < 2) {
                        str = '0' + (date['month'] + 1);
                  } else {
                        str += date['month'] + 1;
                  }
                  str += '/' + date['year'];
            }
            return this.fillData(str, qty, left);
      }

      private dyanmicDownloadByHtmlTag(arg: {
            fileName: string,
            text: string
      }) {
            const setting = {
                  element: {
                        dynamicDownload: null as HTMLElement
                  }
            };
            console.log(arg);

            if (!setting.element.dynamicDownload) {
                  setting.element.dynamicDownload = document.createElement('a');
            }
            const element = setting.element.dynamicDownload;
            const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
            element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
            element.setAttribute('download', arg.fileName);

            const event = new MouseEvent('click');
            element.dispatchEvent(event);
      }


      //     end download flat file


      ngOnInit() {
      }

}
