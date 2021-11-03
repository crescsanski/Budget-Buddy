import { SmallWidgetComponent } from './small-widget/small-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicWidgetComponent } from './basic-widget/basic-widget.component';
import {SliderModule} from 'primeng/slider';
import { ReceiptTrackingComponent } from './receipt-tracking/receipt-tracking.component';




@NgModule({
  declarations: [
    BasicWidgetComponent,
    SmallWidgetComponent,
    ReceiptTrackingComponent
  ],
  imports: [
    CommonModule,
    SliderModule
  ],
  exports: [BasicWidgetComponent, SmallWidgetComponent, ReceiptTrackingComponent]
})
export class WidgetModule { }
