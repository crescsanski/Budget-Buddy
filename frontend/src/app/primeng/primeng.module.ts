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
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [  ],
  imports: [
    InputNumberModule,
    CalendarModule,
    MessagesModule, 
    DropdownModule,
    PasswordModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    ToastModule,
    SliderModule,
    InputTextModule,
  ],
  exports: [
    InputNumberModule,
    CalendarModule,
    MessagesModule,
    PasswordModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    ToastModule,
    DropdownModule,
    SliderModule,
    InputTextModule,
  ],
  providers: [
    MessageService
  ],
  bootstrap: []
})
export class PrimengModule { }
