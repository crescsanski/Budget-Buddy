import { DialogModule } from 'primeng/dialog';
import { WeeklySpendingSmallComponent } from './weekly-spending-small/weekly-spending-small.component';
import { SmallWidgetComponent } from './small-widget/small-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicWidgetComponent } from './basic-widget/basic-widget.component';
import { ReceiptTrackingComponent } from './receipt-tracking/receipt-tracking.component';
import { TrackingComponent } from './tracking/tracking.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WeeklySpendingComponent } from './weekly-spending/weekly-spending.component';
import {ProgressBarModule} from 'primeng/progressbar';
import { IncomeTrackingComponent } from './income-tracking/income-tracking.component';
import {ChartModule} from 'primeng/chart';
import { SavingsOverTimeComponent } from './savings-over-time/savings-over-time.component';
import { BadgesWidgetComponent } from './badges-widget/badges-widget.component';
import { BudgetSliderComponent } from './budget-slider/budget-slider.component';
import {OverlayPanel, OverlayPanelModule} from 'primeng/overlaypanel';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import { SpendingVsIncomeComponent } from './spending-vs-income/spending-vs-income.component';
import { BudgetVsSpendingComponent } from './budget-vs-spending/budget-vs-spending.component';
import { ActualVsEstIncomeComponent } from './actual-vs-est-income/actual-vs-est-income.component';
import { SpendingByCategoryComponent } from './spending-by-category/spending-by-category.component';
import { LetterGradeComponent } from './letter-grade/letter-grade.component';
import { BudgetBreakdownChartComponent } from './budget-breakdown-chart/budget-breakdown-chart.component';
import { TrophiesComponent } from './trophies/trophies.component';


@NgModule({
  declarations: [
    BasicWidgetComponent,
    SmallWidgetComponent,
    ReceiptTrackingComponent,
    TrackingComponent,
    WeeklySpendingComponent,
    WeeklySpendingSmallComponent,
    IncomeTrackingComponent,
    SavingsOverTimeComponent,
    BadgesWidgetComponent,
    BudgetSliderComponent,
    SpendingVsIncomeComponent,
    BudgetVsSpendingComponent,
    ActualVsEstIncomeComponent,
    SpendingByCategoryComponent,
    LetterGradeComponent,
    BudgetBreakdownChartComponent,
    TrophiesComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    ProgressBarModule,
    ChartModule,
    FormsModule,
    OverlayPanelModule,
    FileUploadModule,
    HttpClientModule,
    DialogModule
  ],
  exports: [BasicWidgetComponent,
    SmallWidgetComponent,
    ReceiptTrackingComponent,
    TrackingComponent,
    WeeklySpendingComponent,
    WeeklySpendingSmallComponent,
    IncomeTrackingComponent,
    SavingsOverTimeComponent,
    BadgesWidgetComponent,
    BudgetSliderComponent,
    SpendingVsIncomeComponent,
    BudgetVsSpendingComponent,
    ActualVsEstIncomeComponent,
    SpendingByCategoryComponent,
    BudgetBreakdownChartComponent,
    TrophiesComponent,
    LetterGradeComponent]
})
export class WidgetModule { }
