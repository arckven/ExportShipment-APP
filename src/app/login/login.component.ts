import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routerTransition } from '../shared/animations/router.animations';
import { AuthService } from '../shared/guard/auth.service';
import { UserService } from '../shared/services/export-shipment/user.service';
import { AppSettings } from '../app-settings';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ToasterService, ToasterConfig } from 'angular2-toaster';

const helper = new JwtHelperService();

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    private toasterService: ToasterService;
    @ViewChild('username') usernameCtrl: ElementRef;
    @ViewChild('password') passwordCtrl: ElementRef;

    constructor(public router: Router, toasterService: ToasterService,
        public http: HttpClient, public auth: AuthService, private usersService: UserService) {
        this.toasterService = toasterService;
        if (auth.isAuthenticated()) {
            auth.goToDashboard();
        }
    }

    public config: ToasterConfig = new ToasterConfig({ positionClass: 'toast-top-full-width' });

    ngOnInit() {
        setTimeout(() => {
            if (this.usernameCtrl !== undefined) {
                this.usernameCtrl.nativeElement.focus();
            }
        }, 1000);
    }


    public authorizeUser(data) {
        console.log(data);
    }

    getAppName(): String {
        return AppSettings.APP_NAME;
    }

    onLoggedin(username: string, password: string) {
        console.log('Aurthenticate : ', username);
        this.toasterService.clear();

        if (username === '') {
            this.toasterService.pop('error', 'Login error', 'User name is empty');
            this.usernameCtrl.nativeElement.focus();
        } else if (password === '') {
            this.toasterService.pop('error', 'Login error', 'Password is empty');
        } else {

            this.usersService.authenticate(username, password)
                .subscribe(data => {
                    this.auth.setToken(data);
                    this.router.navigate(['/dashboard']);
                },
                    err => {
                        this.toasterService.pop('error', 'Server error', err.message);
                    }
                );
        }
    }
}
