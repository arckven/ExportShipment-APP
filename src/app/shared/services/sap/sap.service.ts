import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSettings } from '../../../app-settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class SapService {
  @BlockUI() blockUI: NgBlockUI;


  constructor(private http: HttpClient) { }

  retriveZMX_SAP_ZOE(plant, salesOrder, delivery): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    const params = { 'imports': {} };

    params.imports['P_PLANT'] = plant;
    params.imports['P_SALESORDER'] = salesOrder;
    params.imports['P_DELIVERY'] = delivery;

    return this.http.post<any>(AppSettings.API_ZMX_SAP_ZOE, params).pipe(
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
