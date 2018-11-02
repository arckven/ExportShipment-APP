import { IModalDialog, IModalDialogOptions, IModalDialogButton, IModalDialogSettings } from 'ngx-modal-dialog';
import { Component, ComponentRef, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-customs-modal',
  templateUrl: './customs-modal.component.html',
  styleUrls: ['./customs-modal.component.sass']
})
export class CustomsModalComponent implements IModalDialog {


  parentInfo: string;
  options: Partial<IModalDialogOptions<any>>;

  @ViewChild('invoiceDateCtrl') invoiceDateCtrl: ElementRef;
  @ViewChild('carrierCtrl') carrierCtrl: ElementRef;
  @ViewChild('trackingCtrl ') trackingCtrl: ElementRef;
  @ViewChild('invoiceCtrl ') invoiceCtrl: ElementRef;
  @ViewChild('plateCtrl ') plateCtrl: ElementRef;
  @ViewChild('sealCtrl ') sealCtrl: ElementRef;
  @ViewChild('transportCtrl ') transportCtrl: ElementRef;
  @ViewChild('incotermCtrl ') incotermCtrl: ElementRef;
  @ViewChild('pedimentCtrl ') pedimentCtrl: ElementRef;

  customsLength = {
    carrier: 35, tracking: 22, invoice: 22, plate: 10, seal: 10, transport: 20, incoterm: 3, pediment: 22
  };

  constructor() {

  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.parentInfo = options.data;
    console.log(options.data);
    setTimeout(() => {
      if (this.invoiceCtrl !== undefined) {
        this.invoiceCtrl.nativeElement.focus();
      }
    }, 500);
  }


}
