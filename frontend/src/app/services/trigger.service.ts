import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Budget } from '../models/budget';
import { Category } from '../models/category';
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
  private favoritesAnnounce = new Subject<void>();

  //Observable streams
  expenReceiptChanged$ = this.expenReceiptChange.asObservable();
  incomReceiptChanged$ = this.incomReceiptChange.asObservable();
  favoritesAnnounced$ = this.favoritesAnnounce.asObservable();
  budgetUpdatedAnnounced$ = this.budgetUpdateAnnounce.asObservable();

  announceBudgetUpdate(budgets: Budget[])
  {
    this.budServ.updateValues(budgets)
    
    this.budgetUpdateAnnounce.next();
  }

  announceFavoritesChange(favorites: Category[])
  {
    this.budServ.updateFavorites(favorites)
    this.budgetUpdateAnnounce.next();
  }

 announceReceiptDelete(rec: Receipt)
{
  this.recDeleteProcess(rec);

  rec.operation = "delete"

  rec.receipt.receipt_is_income ? this.incomReceiptChange.next(rec) : this.expenReceiptChange.next(rec)
  
}

  recDeleteProcess(rec: Receipt)
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
  }

  recAddProcess(rec: Receipt)
  {
    if (rec.receipt.receipt_is_income)
    {
      this.incHis.updateValues(rec, "new");
    }
    else
    {
      this.spenHis.updateValues(rec, "new")
    }
    this.savHis.updateValues(rec, "new")
  }

 announceReceiptUpdate(oldReceipt: Receipt, rec: Receipt)
  {

      this.recDeleteProcess(oldReceipt)
      this.recAddProcess(rec);  

       rec.operation = "update"

      rec.receipt.receipt_is_income ? this.incomReceiptChange.next(rec) : this.expenReceiptChange.next(rec)
  }

  announceExpenReceiptSubmit(rec: Receipt)
  {

    this.recAddProcess(rec)

    rec.operation = "new"

    this.expenReceiptChange.next(rec);
  }

  announceIncomReceiptSubmit(rec: Receipt)
  {
    
    this.recAddProcess(rec)
    rec.operation = "new"

    this.incomReceiptChange.next(rec);
  }

  constructor(private spenHis: SpendingHistoryService, private savHis: SavingsHistoryService,
    private incHis: IncomeHistoryService, private budServ: BudgetService) { }
}
