import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { AppSettings } from '../../app-settings';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userInformation;
  private applications:Object=[];

  constructor(public router: Router, public toasterService: ToasterService) {
    this.userInformation = {};
  }

  public getToken(): string {
    return localStorage.getItem(AppSettings.TOKEN_ID);
  }

  public setToken(data) {
    if (data.success) {
      localStorage.setItem(AppSettings.TOKEN_ID, data.result);
      this.goToDashboard();
    } else {
      this.toasterService.pop('error', data.detail[0].toUpperCase() + data.detail.slice(1));
    }
  }

  public removeToken() {
    localStorage.removeItem(AppSettings.TOKEN_ID);
  }

  public getData(): object {
    return helper.decodeToken(this.getToken());
  }

  public goToLogin() {
    this.router.navigate(['/login']);
  }

  public goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  public goToDenied() {
    this.router.navigate(['/access-denied']);
  }

  public roleMatch(allowedRoles): boolean {
    let isMatch = false;
    if (allowedRoles) {
      const userRoles: string[] = this.getData()['roles'];
      allowedRoles.forEach(element => {
        userRoles.forEach(userRole => {
          if (element === userRole['role']) {
            isMatch = true;
            return false;
          }
        });

      });
    } else {
      return false;
    }
    return isMatch;
  }

  public isAuthenticated(): boolean {
    const expired = helper.isTokenExpired(this.getToken());
    if (!expired) {
      return true;
    } else {
      // this.goToLogin();
      return false;
    }
  }

}
