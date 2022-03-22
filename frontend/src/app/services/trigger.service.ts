import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Budget } from '../models/budget';
import { Receipt } from '../models/receipt';
import { QuickReceipt } from '../models/simReceipt';
import { BudgetService } from './budget.service';
import { IncomeHistoryService } from './income-history.service';
import { SavingsHistoryService } from './savings-history.service';
import { SpendingHistoryService } from './spending-history.service';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  // Observable sources
  private expenReceiptChange = new Subject<Receipt>();
  private incomReceiptChange = new Subject<Receipt>();

  private budgetUpdateAnnounce = new Subject<Budget[]>();

  //Observable streams
  expenReceiptChanged$ = this.expenReceiptChange.asObservable();
  incomReceiptChanged$ = this.incomReceiptChange.asObservable();

  budgetUpdatedAnnounced$ = this.budgetUpdateAnnounce.asObservable();

  announceBudgetUpdate(budgets: Budget[])
  {
    this.budServ.updateValues(budgets)
    
    this.budgetUpdateAnnounce.next();
  }

 announceReceiptDelete(rec: Receipt)
{
  if (rec.receipt.receipt_is_income)
  {
    this.incHis.updateValues(rec, "delete");
  }
  else
  {
    this.spenHis.updateValues(rec, "delete");
  }
  this.savHis.updateValues(rec, "delete");

  rec.operation = "delete"

  rec.receipt.receipt_is_income ? this.incomReceiptChange.next(rec) : this.expenReceiptChange.next(rec)
  
}
 announceReceiptUpdate(rec: Receipt)
  {
    if (rec.receipt.receipt_is_income)
    {
      this.incHis.updateValues(rec, "update");
    }
    else
    {
      this.spenHis.updateValues(rec, "update");
    }
    this.savHis.updateValues(rec, "update");

    rec.operation = "update"

    rec.receipt.receipt_is_income ? this.incomReceiptChange.next(rec) : this.expenReceiptChange.next(rec)
  }

  announceExpenReceiptSubmit(rec: Receipt)
  {

    this.spenHis.updateValues(rec, "new")
    this.savHis.updateValues(rec, "new")

    rec.operation = "new"

    this.expenReceiptChange.next(rec);
  }

  announceIncomReceiptSubmit(rec: Receipt)
  {
    this.incHis.updateValues(rec, "new");
    this.savHis.updateValues(rec, "new");

    rec.operation = "new"

    this.incomReceiptChange.next(rec);
  }

  constructor(private spenHis: SpendingHistoryService, private savHis: SavingsHistoryService,
    private incHis: IncomeHistoryService, private budServ: BudgetService) { }
}
