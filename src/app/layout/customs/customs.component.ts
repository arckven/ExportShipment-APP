import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { routerTransition } from '../../shared/animations/router.animations';
import { ShipmentService } from '../../shared/services/export-shipment/shipment.service';
import { CustomsModalComponent } from './customs-modal/customs-modal.component';
import { of } from 'rxjs';


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
    showCartonBtn: false
  };

  constructor(private modalService: ModalDialogService,
    private viewRef: ViewContainerRef, public toasterService: ToasterService, public shipment: ShipmentService) {

  }




  toggle(value): boolean {
    this.toasterService.clear();
    if (value === undefined || value === false) {
      for (const shipments of this.childSearch['result']) {
        shipments.collapsed = false;
      }
      value = true;
    } else {
      value = false;
    }
    return value;
  }

  editShipment(shipments): void {

    this.shipment.updateShipment(shipments).subscribe(
      data => {
        console.log(data);
        this.toasterService.pop(String(data['status']).toLowerCase(), data['detail']);
        if (!data['success']) {
          this.changeStatus('CUSTOMS', 'SHIPMENT');
        }
      },
      err => {
        console.log(err);
        this.toasterService.pop('error', err.status + ' - ' + err.message);
        this.changeStatus('CUSTOMS', 'SHIPMENT');
      }
    );

  }

  changeStatus(oldStatus, newStatus): void {
    for (const shipments of this.childSearch['result']) {
      if (shipments['selected'] && shipments['status'] === oldStatus) {
        shipments['status'] = newStatus;
        for (const details of shipments['expShipmentDetails']) {
          if (details['status'] === oldStatus) {
            details['status'] = newStatus;
          }
        }
      }
    }
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
    console.log('Close Shipment');
    const shipments = [];
    if (this.ShipmentEditable(shipment)) {
      shipment['status'] = 'CUSTOMS';
      for (const details of shipment['expShipmentDetails']) {
        if (details['status'] === 'SHIPMENT') {
          details['status'] = 'CUSTOMS';
        }
      }
      for (const customs of shipment['expShipmentCustoms']) {
        if (customs['status'] === 'SHIPMENT') {
          customs['status'] = 'CUSTOMS';
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
    if (shipment['status'] !== 'SHIPMENT') {
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
        title: 'Close Customs ',
        childComponent: SimpleModalComponent,
        data: {
          text: 'Do you want to close the selected shipments?'
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
            text: 'Close Customs',
            buttonClass: 'btn btn-primary',
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
      if (shipment['status'] === 'CUSTOMS') {
        this.modalService.openDialog(this.viewRef, {
          title: 'Open Customs ',
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
              text: 'Open Customs',
              buttonClass: 'btn btn-success',
              onAction: () => new Promise((resolve: any) => {
                console.log('saved');
                shipment['status'] = 'SHIPMENT';
                for (const details of shipment['expShipmentDetails']) {
                  if (details['status'] === 'CUSTOMS') {
                    details['status'] = 'SHIPMENT';
                  }
                }
                for (const customs of shipment['expShipmentCustoms']) {
                  if (customs['status'] === 'CUSTOMS') {
                    customs['status'] = 'SHIPMENT';
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

  removeInvoice(header, customs): void {
    if (customs['status'] === 'NEW') {
      const index = header['expShipmentCustoms'].indexOf(customs, 0);
      if (index > -1) {
        header['expShipmentCustoms'].splice(index, 1);
      }
    } else {
      customs['status'] = 'DELETED';
    }
  }

  editInvoice(header, customs): void {
    customs['status'] = 'UPDATED';
    this.popupInvoice(header, customs);
  }

  addInvoice(header, customs): void {
    if (customs === undefined || customs == null) {
      customs = { pediment: undefined, incoterm: undefined, invoice: undefined, invoiceDate: new Date(), status: 'NEW' };
    }
    this.popupInvoice(header, customs);
  }

  popupInvoice(header, customs): void {

    this.toasterService.clear();
    if (header['status'] === 'SHIPMENT') {


      const tmpdate = new Date(customs['invoiceDate']);
      console.log(tmpdate, tmpdate.getUTCDate);
      const data = {
        carrier: header['carrier'], tracking: header['tracking'], customsInvoice: customs['customsInvoice'], plate: header['plate'],
        seal: header['seal'], transportType: header['transportType'], incoterm: header['incoterm'], pediment: customs['pediment'],
        date: { year: tmpdate.getFullYear(), month: (tmpdate.getMonth() + 1), day: tmpdate.getUTCDate() }
      };

      this.modalService.openDialog(this.viewRef, {
        title: 'Customs infomation',
        childComponent: CustomsModalComponent,
        data: data,
        settings: { modalDialogClass: 'modal-lg modal-dialog modal-dialog-centered' },
        actionButtons: [
          {
            text: 'Cancel',
            buttonClass: 'btn btn-danger',
            onAction: () => new Promise((resolve: any, reject: any) => {
              this.toasterService.clear();
              resolve();
            })
          },
          {
            text: 'Save',
            buttonClass: 'btn btn-primary',
            onAction: () => new Promise((resolve: any, reject: any) => {
              this.toasterService.clear();

              if (!this.validateCustoms(data)) {
                reject();
              } else {

                header['carrier'] = data['carrier'];
                header['tracking'] = data['tracking'];
                customs['customsInvoice'] = data['customsInvoice'];
                header['plate'] = data['plate'];
                header['seal'] = data['seal'];
                header['transportType'] = data['transportType'];
                header['incoterm'] = data['incoterm'];
                customs['pediment'] = data['pediment'];
                customs['invoiceDate'] = new Date(data['date']['year'],
                  data['date']['month'] - 1, data['date']['day']).getTime();

                if (customs['status'] === 'NEW') {
                  header['expShipmentCustoms'].push(customs);
                }
                resolve();
              }
            })
          }
        ]
      });
    } else {
      this.toasterService.pop('warning', 'Shipment ' + header['shipmentHeaderId'] + ' can not be updated');
    }
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

  getSummary(lst, asn) {
    for (const asnTmp of lst) {
      if (asnTmp['asn'] === asn) {
        return asnTmp;
      }
    }
    return null;
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

  downloadFlatFile(header): void {
    this.prepareFlatFile(header)
      .subscribe(res => {

        let fileName = '';
        const date = new Date();
        fileName += (String(date.getMonth() + 1).length < 2) ? '0' + String(date.getMonth() + 1) : String(date.getMonth() + 1);
        fileName += (String(date.getDay() + 1).length < 2) ? '0' + String(date.getDay() + 1) : String(date.getDay() + 1);
        fileName += String(date.getFullYear());
        fileName += '.csv';

        this.dyanmicDownloadByHtmlTag({
          fileName: fileName,
          text: res
        });

      });
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

  ngOnInit() {
    this.toasterService.clear();
  }

}
