import { Injectable } from '@angular/core';
import {MessageService as MS} from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MessageService {

  constructor(private messageService: MS) {}


  addError(summary: string, detail: string) {
    this.messageService.add({severity:'error', summary:summary, detail:detail});
  }

  addSuccess(summary: string, detail: string) {
    this.messageService.add({severity:'success', summary:summary, detail:detail});
  }

  addInfo(summary: string, detail: string) {
    this.messageService.add({severity:'info', summary:summary, detail:detail});
  }

  clear() {
    this.messageService.clear()
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/