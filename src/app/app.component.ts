import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'ExportShipment-App';

   // animation property: 'fade', 'flyLeft', 'flyRight', 'slideDown', and 'slideUp'. 
   public config: ToasterConfig =
   new ToasterConfig({
       showCloseButton: true,
       tapToDismiss: true,
       limit: 5,
       timeout: 10000,
       animation: 'flyLeft',
      positionClass: 'toast-top-right',
       mouseoverTimerStop: false
   });
   
}
