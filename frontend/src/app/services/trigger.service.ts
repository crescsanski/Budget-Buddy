import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  // Observable sources
  private receiptSubmitAnnounce = new Subject<void>();

  //Obsevable streams
  receiptAnnounced$ = this.receiptSubmitAnnounce.asObservable();

  announceReceiptSubmit()
  {
    this.receiptSubmitAnnounce.next();
  }

  constructor() { }
}
