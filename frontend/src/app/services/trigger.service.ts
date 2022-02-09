import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SpendingHistoryService } from './spending-history.service';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  // Observable sources
  private expenReceiptSubmitAnnounce = new Subject<void>();

  //Obsevable streams
  expenReceiptAnnounced$ = this.expenReceiptSubmitAnnounce.asObservable();

  async announceExpenReceiptSubmit()
  {
    // Update weekly spending total
    await (this.spenHis.getCurWeekSpend().toPromise());
    this.expenReceiptSubmitAnnounce.next();
  }

  constructor(private spenHis: SpendingHistoryService) { }
}
