import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSettings } from '../../../app-settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  @BlockUI() blockUI: NgBlockUI;

  configuration: Object = {};

  constructor(private http: HttpClient) { }

  retriveConfiguration(propertyGroup): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'utils/configuration/' + propertyGroup;
    return this.http.get<any>(url, {}).pipe(
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

  getConfiguration(): any {
    return this.configuration;
  }

  setConfiguration(configuration: any) {
    this.configuration = configuration;
  }


}
