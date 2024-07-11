import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import es_CO from '@angular/common/locales/es-CO';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './utils/auth-interceptor.service';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

registerLocaleData(es_CO, 'es');

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
AppRoutingModule,

    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NzNotificationModule
  ],
  providers: [
    { provide: Window, useValue: window },
    { provide: Document, useValue: document },
    { provide: Navigator, useValue: navigator },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'COP' },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: NZ_I18N, useValue: es_ES },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
