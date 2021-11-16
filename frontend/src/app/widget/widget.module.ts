import { SmallWidgetComponent } from './small-widget/small-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicWidgetComponent } from './basic-widget/basic-widget.component';
import {SliderModule} from 'primeng/slider';
import { ReceiptTrackingComponent } from './receipt-tracking/receipt-tracking.component';
import { SpendingTrackingComponent } from './spending-tracking/spending-tracking.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    BasicWidgetComponent,
    SmallWidgetComponent,
    ReceiptTrackingComponent,
    SpendingTrackingComponent

  ],
  imports: [
    CommonModule, 
    SliderModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  exports: [BasicWidgetComponent, SmallWidgetComponent, ReceiptTrackingComponent, SpendingTrackingComponent]
})
export class WidgetModule { }
