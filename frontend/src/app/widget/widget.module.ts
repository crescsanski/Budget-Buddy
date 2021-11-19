import { WeeklySpendingSmallComponent } from './weekly-spending-small/weekly-spending-small.component';
import { SmallWidgetComponent } from './small-widget/small-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicWidgetComponent } from './basic-widget/basic-widget.component';
import { ReceiptTrackingComponent } from './receipt-tracking/receipt-tracking.component';
import { TrackingComponent } from './tracking/tracking.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WeeklySpendingComponent } from './weekly-spending/weekly-spending.component';
import {ProgressBarModule} from 'primeng/progressbar';
import { IncomeTrackingComponent } from './income-tracking/income-tracking.component';
import {ChartModule} from 'primeng/chart';
import { SavingsOverTimeComponent } from './savings-over-time/savings-over-time.component';
import { BadgesWidgetComponent } from './badges-widget/badges-widget.component';


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
    BadgesWidgetComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    ProgressBarModule,
    ChartModule
  ],
  exports: [BasicWidgetComponent, SmallWidgetComponent, ReceiptTrackingComponent, TrackingComponent, WeeklySpendingComponent, 
    WeeklySpendingSmallComponent, IncomeTrackingComponent, SavingsOverTimeComponent, BadgesWidgetComponent]
})
export class WidgetModule { }
