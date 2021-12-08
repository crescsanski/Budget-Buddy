import { WidgetModule } from '../widget/widget.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { MenuComponent } from './main-page/menu/menu.component';
import {MenuModule} from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NewBudgetComponent } from './budget-creator/new-budget/new-budget.component';
import { BudgetPanelComponent } from './budget-creator/budget-panel/budget-panel.component';
import { PrimengModule } from '../primeng/primeng.module';






@NgModule({
  declarations: [
    MainPageComponent,
    MenuComponent,
    NewBudgetComponent,
    BudgetPanelComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    WidgetModule,
    PrimengModule  ],
 
})
export class HomeModule { }
