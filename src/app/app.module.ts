import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from './shared/components/block-template/block-template.component';

import { ToasterModule } from 'angular2-toaster';
import { AuthGuard } from './shared/guard/auth.guard';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { TokenInterceptorService } from './shared/interceptors/token-interceptor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser, faLock, faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

// Add an icon to the library for convenient access in other components
library.add(faUser, faLock, faSignInAlt);

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  /* for development
  return new TranslateHttpLoader(
      http,
      '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
      '.json'
  ); */
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    BlockTemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToasterModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgProgressModule.forRoot({
      trickleSpeed: 200,
      min: 20,
      meteor: true,
      spinnerPosition: 'right'
    }),
    NgProgressRouterModule.forRoot(),
    NgProgressHttpModule.forRoot(),
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    FontAwesomeModule,
  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: [BlockTemplateComponent]
})
export class AppModule { }
