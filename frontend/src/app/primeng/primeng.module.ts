import { NgModule } from '@angular/core';

import {InputMaskModule} from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {MessagesModule} from 'primeng/messages';
import { MessageService } from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import {TabViewModule} from 'primeng/tabview';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ProgressBarModule} from 'primeng/progressbar';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {SelectButtonModule} from 'primeng/selectbutton';

@NgModule({
  declarations: [  ],
  imports: [
    InputNumberModule,
    ProgressSpinnerModule,
    ConfirmPopupModule,
    ProgressBarModule,
    CalendarModule,
    MultiSelectModule,
    MessagesModule, 
    DropdownModule,
    PasswordModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    ToastModule,
    SliderModule,
    InputTextModule,
    TabViewModule,
    SelectButtonModule
  ],
  exports: [
    InputNumberModule,
    CalendarModule,
    ProgressBarModule,
    MessagesModule,
    PasswordModule,
    ProgressSpinnerModule,
    ConfirmPopupModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    MultiSelectModule,
    ToastModule,
    DropdownModule,
    SliderModule,
    InputTextModule,
    TabViewModule,
    SelectButtonModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: []
})
export class PrimengModule { }
