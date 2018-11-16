import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSettings } from '../../../app-settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  @BlockUI() blockUI: NgBlockUI;

  constructor(private http: HttpClient) { }

  getShipment(search): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'shipment/' + search['plant'].toUpperCase() + '/';
    url += search['criteria'].toLowerCase().replace(' ', '') + '/';
    url += search['value'];
    return this.http.get<any>(url, { }).pipe(
      tap(
        (response) => {
          this.blockUI.stop();
        },
        (err: any) => {
          console.log('error');
          this.blockUI.stop();
        }
      )
    );
  }


  updateShipment(shipmentLst): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    const url = AppSettings.API_ENDPOINT + 'shipment/update';
    return this.http.post<any>(url, shipmentLst).pipe(
      tap(
        (response) => {
          this.blockUI.stop();
        },
        (err: any) => {
          console.log('error');
          this.blockUI.stop();
        }
      )
    );
  }


  getSummary(): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'shipment/summary';
    return this.http.get<any>(url, {})
      .pipe(
        tap(
          (response) => {
            this.blockUI.stop();
          },
          (err: any) => {
            console.log('error');
            this.blockUI.stop();
          }
        )
      );
  }
}
