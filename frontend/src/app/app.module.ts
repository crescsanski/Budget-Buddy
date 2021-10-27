import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { LoginNavComponent } from './login/login-nav/login-nav.component';
import { LoginPanelComponent } from './login/login-panel/login-panel.component';
import { PasswordModule } from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import { AuthInterceptor } from './helpers/authInterceptor.service';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginNavComponent,
    LoginPanelComponent,
    HomeComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
