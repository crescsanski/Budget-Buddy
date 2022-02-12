import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SavingsHistoryService } from './savings-history.service';
import { SpendingHistoryService } from './spending-history.service';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  // Observable sources
  private expenReceiptSubmitAnnounce = new Subject<void>();
  private incomReceiptSubmitAnnounce = new Subject<void>();

  //Obsevable streams
  expenReceiptAnnounced$ = this.expenReceiptSubmitAnnounce.asObservable();
  incomReceiptAnnounced$ = this.incomReceiptSubmitAnnounce.asObservable();

  async announceExpenReceiptSubmit()
  {
    // Update weekly spending total
    await (this.spenHis.getCurWeekSpend().toPromise());
    // Update savings widget
    await (this.savHis.getByMonthCumSavings().toPromise());
    this.expenReceiptSubmitAnnounce.next();
  }

  async announceIncomReceiptSubmit()
  {
    // Update savings widget
    await (this.savHis.getByMonthCumSavings().toPromise());
    this.incomReceiptSubmitAnnounce.next();
  }

  constructor(private spenHis: SpendingHistoryService, private savHis: SavingsHistoryService) { }
}
