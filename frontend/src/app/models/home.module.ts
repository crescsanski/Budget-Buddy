import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { WidgetModule } from '../widget/widget.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from '../home/main-page/main-page.component';
import { MenuComponent } from '../home/main-page/menu/menu.component';
import {MenuModule} from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NewBudgetComponent } from '../home/budget-creator/new-budget/new-budget.component';
import { BudgetPanelComponent } from '../home/budget-creator/budget-panel/budget-panel.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import { BudgetAdvisorComponent } from '../home/budget-creator/budget-advisor/budget-advisor.component';
import {ChartModule} from 'primeng/chart';
import {DialogModule} from 'primeng/dialog';
import { BudgetAdjusterComponent } from '../home/budget-creator/budget-adjuster/budget-adjuster.component';
import {ListboxModule} from 'primeng/listbox';
import { BudgetAlgorithmComponent } from '../home/budget-creator/budget-algorithm/budget-algorithm.component';









@NgModule({
  declarations: [
    MainPageComponent,
    MenuComponent,
    NewBudgetComponent,
    BudgetPanelComponent,
    BudgetAdvisorComponent,
    BudgetAdjusterComponent,
    BudgetAlgorithmComponent
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
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    OverlayPanelModule,
    ListboxModule
    ],
 
})
export class HomeModule { }
