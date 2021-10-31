import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { MenuComponent } from './main-page/menu/menu.component';
import {MenuModule} from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';





@NgModule({
  declarations: [
    MainPageComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    RippleModule
  ],
 
})
export class HomeModule { }
