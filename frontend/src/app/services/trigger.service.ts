import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Budget } from '../models/budget';
import { Category } from '../models/category';
import { Challenge } from '../models/Challenge';
import { Receipt } from '../models/receipt';
import { QuickReceipt } from '../models/simReceipt';
import { BudgetService } from './budget.service';
import { ChallengesService } from './challenges.service';
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

  private challAnnounce = new Subject<void>();
  private levelAnnounce = new Subject<void>();
  private budgetUpdateAnnounce = new Subject<Budget[]>();
  private favoritesAnnounce = new Subject<void>();
  private challComplete = new Subject<Challenge>();

  //Observable streams
  levelGained$ = this.levelAnnounce.asObservable();
  expenReceiptChanged$ = this.expenReceiptChange.asObservable();
  incomReceiptChanged$ = this.incomReceiptChange.asObservable();
  favoritesAnnounced$ = this.favoritesAnnounce.asObservable();
  budgetUpdatedAnnounced$ = this.budgetUpdateAnnounce.asObservable();
  challAnnounced$ = this.challAnnounce.asObservable();
  challCompletedAnnounced$ = this.challComplete.asObservable();

  async announceChallengeUpdate()
  {
    await (this.challServ.getChallenges().toPromise());
    this.challAnnounce.next();

    this.findNewCompleted(this.challServ.pre_Inv, this.challServ.challenges);
  }

  async announceChallengeComplete(chall: Challenge)
  {
    this.challComplete.next(chall);

    if (this.challServ.preLev_Prog.level < this.challServ.levProgress.level)
    {
      this.announceLevelGain();
    }
  }

  async announceLevelGain()
  {
    this.levelAnnounce.next();
  }

  announceBudgetUpdate(budgets: Budget[])
  {
    this.budServ.updateValues(budgets)
    
    this.budgetUpdateAnnounce.next();
  }

  announceFavoritesChange(favorites: Category[], shouldUpWid: boolean)
  {
    this.budServ.updateFavorites(favorites)
    if (shouldUpWid)
    {
      this.budgetUpdateAnnounce.next();
    }
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

    this.checkTrigger('record_expense')

    this.recAddProcess(rec)

    rec.operation = "new"

    this.expenReceiptChange.next(rec);
  }

  announceIncomReceiptSubmit(rec: Receipt)
  {

    this.checkTrigger('record_income')
    
    this.recAddProcess(rec)
    rec.operation = "new"

    this.incomReceiptChange.next(rec);
  }

  checkTrigger(type: string)
  {
    if (this.challServ.trigs.has(type))
    {
      this.announceChallengeUpdate();
    }
  }

  //Compares old and new challenge inventory to check whether any challenges that were previously active and still in progress
  // are now complete.
  findNewCompleted(oldInv: Challenge[], newInv: Challenge[]): void
  {
    let candidates = oldInv.filter(val => val.is_active && val.completion_date == null).map(val => val.id)

    newInv.filter(val => val.is_active && val.completion_date != null).forEach((val) => {
      if (candidates.includes(val.id))
      {
        this.announceChallengeComplete(val);
      }
    })
  }

  constructor(private spenHis: SpendingHistoryService, private savHis: SavingsHistoryService,
    private incHis: IncomeHistoryService, private challServ: ChallengesService,
    private budServ: BudgetService) { }
}
