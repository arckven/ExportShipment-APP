import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../shared/animations/router.animations';
import { ToasterService } from 'angular2-toaster';
import { ShipmentService } from '../../shared/services/export-shipment/shipment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

  public alerts: Array<any> = [];
  public sliders: Array<any> = [];
  public isLogged = false;
  public summary = {};


  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'top',
      labels: { fintsize: 14 }
    }
  };

  public lineChartColors: Array<any> = [
    { // blue
      backgroundColor: '#007bff',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // green
      backgroundColor: '#66bb6a',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // light blue
      backgroundColor: '#26c6da',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
    ,
    { // yellow
      backgroundColor: '#beca0d',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public pendingByCustomer = {};

  public barChartType: String = 'bar';
  public barChartLegend: Boolean = true;

  constructor(public toasterService: ToasterService, public shipmentService: ShipmentService) {

  }

  getSummary() {
    this.shipmentService.getSummary()
      .subscribe(data => {
        if (data && data['result']) {
          this.summary = data['result'];
          this.pendingByCustomer = data['result'];
        }
      },
        err => {
          this.toasterService.pop('error', err.status + ' - ' + err.message);
          this.summary = {};
        }
      );


  }



  ngOnInit() {
    this.getSummary();
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

}
