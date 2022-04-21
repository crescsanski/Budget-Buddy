import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { BudgetService } from "../services/budget.service";
import { BudgetScoreService } from "../services/budget_score.service";
import { CategoryService } from "../services/category.service";
import { ChallengesService } from "../services/challenges.service";
import { IncomeHistoryService } from "../services/income-history.service";
import { SavingsHistoryService } from "../services/savings-history.service";
import { SpendingHistoryService } from "../services/spending-history.service";
import { TimeService } from "../services/time.service";
import { ReceiptTrackService } from "../widget/services/receipt-track.service";

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
    constructor(private budServ: BudgetService,
        private spenTot: SpendingHistoryService,
        private budSco: BudgetScoreService,
        private chalServ: ChallengesService,
        private rs: ReceiptTrackService,
        private incServ: IncomeHistoryService,
        private savServ: SavingsHistoryService,
        private ts: TimeService,
        private catService: CategoryService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    
    var urgentObservArray = []
    if (this.catService.expenseCats == null || this.catService.incomeCats == null)
    {
        urgentObservArray.push(this.catService.getCategories())
    }

    var lazyObservArray = []

    //This observable holds the api calls that don't need to be complete by the time the user logs in
    const lazyObservable = forkJoin( lazyObservArray.concat([

        //Fetch receipts for user:
        this.rs.getReceipts(),

        //Fetch challenges for user:
        this.chalServ.getChallenges(),

        //Fetch Default Display for Savings over Time Widget
        this.savServ.getCumSavings(),

        //Fetch Default Display for Spending over Time Widget
        this.spenTot.getByMonthCumSpendings(),

        //Fetch Default Display for Income over Time Widget
        this.incServ.getByMonthCumIncome(),

        //Fetch Income and Expense Budgets By Category
        this.budServ.getBudByCat(),

        this.spenTot.getSpendCatBreakdown(),

        this.incServ.getIncomeCatBreakdown(),

    ]))
   
    //This observable holds only the api calls that MUST BE MADE before the dashboard is loaded
    const urgentObservable = forkJoin( urgentObservArray.concat([
    
        //Fetch Weekly and Monthly Budgets for the app:
        this.budServ.getBudgetTotals(),

        
        this.incServ.getByMonthIncome(),

        this.spenTot.getByMonthSpendings(),

        //Fetch Weekly Spending Total
        this.spenTot.getCurWeekSpend(),

        //Fetch BudgetScore
        this.budSco.getBudgetScore()
    ])).pipe(
        finalize(() =>
        {
             //We'll let the lazy observable run, but will not require it to finish in order to get to the next screen.
             //We'll only start it after the required pieces have loaded.
            lazyObservable.subscribe()
        })
    )

    return urgentObservable;
    
    }
}