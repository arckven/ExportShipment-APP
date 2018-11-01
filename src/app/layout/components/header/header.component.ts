import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../shared/guard/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  pushRightClass = 'push-right';

  constructor(private translate: TranslateService, public router: Router, public auth: AuthService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });


  }

  ngOnInit() {
    // const timer = Observable.timer(2000, 100000);
    // timer.subscribe(t => {
    //     console.log(t);
    // }
    // );
  }

  getUserName() {
    const userInformation = this.auth.getData();
    if (userInformation) {
      if (userInformation['properties'] !== undefined) {
        return userInformation['properties'].FirstName + ' ' + userInformation['properties'].LastName;
      } else {
        return '';
      }
    } else {
      this.auth.goToLogin();
    }
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedout() {
    this.auth.removeToken();
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

}
