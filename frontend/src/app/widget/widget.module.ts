import { ButtonModule } from 'primeng/button';
import { SmallWidgetComponent } from './small-widget/small-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicWidgetComponent } from './basic-widget/basic-widget.component';
import {SliderModule} from 'primeng/slider';
import { ReceiptTrackingComponent } from './receipt-tracking/receipt-tracking.component';
import { TrackingComponent } from './tracking/tracking.component';
import { InputTextModule } from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar'



@NgModule({
  declarations: [
    BasicWidgetComponent,
    SmallWidgetComponent,
    ReceiptTrackingComponent,
    TrackingComponent
  ],
  imports: [
    CommonModule,
    SliderModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  exports: [BasicWidgetComponent, SmallWidgetComponent, ReceiptTrackingComponent, TrackingComponent]
})
export class WidgetModule { }
