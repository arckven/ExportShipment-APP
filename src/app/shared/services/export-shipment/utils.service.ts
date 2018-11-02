import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../../../app-settings';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  configuration: Object = {};

  constructor(private http: HttpClient) { }

  retriveConfiguration(propertyGroup): Observable<any> {
    let url = AppSettings.API_ENDPOINT;
    url += 'utils/configuration/' + propertyGroup;
    return this.http.get<any>(url, {});
  }

  getConfiguration(): any {
    return this.configuration;
  }

  setConfiguration(configuration: any) {
    this.configuration = configuration;
  }


}
