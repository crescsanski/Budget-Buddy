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
  ],
  providers: [
    MessageService
  ],
  bootstrap: []
})
export class PrimengModule { }
