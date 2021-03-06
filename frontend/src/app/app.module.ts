import { WidgetModule } from './widget/widget.module';
import { HomeModule } from './models/home.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { LoginNavComponent } from './home/main-page/login-nav/login-nav.component';
import { LoginPanelComponent } from './login/login-panel/login-panel.component';
import { AuthInterceptor } from './helpers/authInterceptor.service';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterPanelComponent } from './register/register-panel/register-panel.component';
import { RegisterNavComponent } from './register/register-nav/register-nav.component';
import { RegisterPageComponent } from './register/register-panel/register-page/register-page.component';
import { PrimengModule } from './primeng/primeng.module';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import { StatusUpdateComponent } from './alerts/status-update/status-update.component';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginNavComponent,
    LoginPanelComponent,
    RegisterPanelComponent,
    RegisterNavComponent,
    RegisterPageComponent,
    StatusUpdateComponent
  ],
  imports: [
    BrowserModule,
    PrimengModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ReactiveFormsModule,
    HttpClientModule,
    HomeModule,
    WidgetModule,
    TooltipModule,
    FormsModule,
    DialogModule
  ],
  exports: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe, CurrencyPipe, PercentPipe, DecimalPipe, ConfirmationService, DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
