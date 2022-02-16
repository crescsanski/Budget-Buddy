import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IncomeHistoryService } from './income-history.service';
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

    // Update spending by month values
    await (this.spenHis.getByMonthCumSpendings().toPromise());

    await (this.spenHis.getByMonthSpendings().toPromise());

    await (this.spenHis.getSpendCatBreakdown().toPromise());

    this.expenReceiptSubmitAnnounce.next();
  }

  async announceIncomReceiptSubmit()
  {
    // Update savings widget
    await (this.savHis.getByMonthCumSavings().toPromise());

    // Update income by month values
    await (this.incHis.getByMonthCumIncome().toPromise());

    await (this.incHis.getByMonthIncome().toPromise());

    this.incomReceiptSubmitAnnounce.next();
  }

  constructor(private spenHis: SpendingHistoryService, private savHis: SavingsHistoryService,
    private incHis: IncomeHistoryService) { }
}
