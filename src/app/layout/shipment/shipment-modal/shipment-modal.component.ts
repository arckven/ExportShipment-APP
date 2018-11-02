import { IModalDialog, IModalDialogOptions, IModalDialogButton, IModalDialogSettings } from 'ngx-modal-dialog';
import { Component, ComponentRef, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ShipmentModalComponent implements IModalDialog {

  parentInfo: string;
  options: Partial<IModalDialogOptions<any>>;

  @ViewChild('weightControl') weightControl: ElementRef;
  @ViewChild('dimensionControl') dimensionControl: ElementRef;
  @ViewChild('myModal ') myModal: ElementRef;

  constructor() {

  }

  saveContainer(): void {
    this.options['actionButtons'][1].onAction();
    console.log(this.options);
  }

  dimensionFocus(): void {
    this.dimensionControl.nativeElement.focus();
  }

  weightFocus(): void {
    this.weightControl.nativeElement.focus();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.parentInfo = options.data;
    this.weightControl.nativeElement.focus();
    setTimeout(() => {
      this.weightControl.nativeElement.focus();
    }, 500);
  }


}
