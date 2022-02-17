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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import { BudgetAdvisorComponent } from './budget-creator/budget-advisor/budget-advisor.component';
import {ChartModule} from 'primeng/chart';
import {DialogModule} from 'primeng/dialog';








@NgModule({
  declarations: [
    MainPageComponent,
    MenuComponent,
    NewBudgetComponent,
    BudgetPanelComponent,
    BudgetAdvisorComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    WidgetModule,
    PrimengModule,
    ReactiveFormsModule,
    SliderModule,
    FormsModule,
    ChartModule,
    DialogModule
    ],
 
})
export class HomeModule { }
