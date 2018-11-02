import { IModalDialog, IModalDialogOptions, IModalDialogButton, IModalDialogSettings } from 'ngx-modal-dialog';
import { Component, ComponentRef, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-sapmodal',
  templateUrl: './sapModal.component.html',
  styleUrls: ['./sapModal.component.scss']
})
export class SapModalComponent implements IModalDialog {

  parentInfo: string;
  options: Partial<IModalDialogOptions<any>>;

  @ViewChild('deliveryControl') deliveryControl: ElementRef;
  @ViewChild('salesOrderControl') salesOrderControl: ElementRef;
  
  constructor() {

  }

  saveContainer(): void {
    this.options['actionButtons'][1].onAction();
    console.log(this.options);
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.parentInfo = options.data;
    this.deliveryControl.nativeElement.focus();
    setTimeout(() => {
      this.deliveryControl.nativeElement.focus();
    }, 500);
  }


}
