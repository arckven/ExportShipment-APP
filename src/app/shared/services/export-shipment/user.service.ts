import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSettings } from '../../../app-settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  @BlockUI() blockUI: NgBlockUI;

  constructor(private http: HttpClient) { }

  authenticate(username, password): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    return this.http.post<any>(AppSettings.API_AUTHENTICATE + '/security/authenticate', { Username: username, Password: password }).pipe(
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

  getAllUsers(): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'utils/allUsers';

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

  getAllRoles(username, password): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'utils/allRoles';
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


  getAllAreas(): Observable<any> {
    this.blockUI.start(AppSettings.API_LOADING_MESSAGE);
    let url = AppSettings.API_ENDPOINT;
    url += 'utils/allAreas';
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

}
