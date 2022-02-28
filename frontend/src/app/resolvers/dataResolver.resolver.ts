import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { BadgesEarnedService } from "../services/badgesEarned.service";
import { BudgetService } from "../services/budget.service";
import { BudgetScoreService } from "../services/budget_score.service";
import { CategoryService } from "../services/category.service";
import { IncomeHistoryService } from "../services/income-history.service";
import { SavingsHistoryService } from "../services/savings-history.service";
import { SpendingHistoryService } from "../services/spending-history.service";
import { TimeService } from "../services/time.service";

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
    constructor(private budServ: BudgetService,
        private spenTot: SpendingHistoryService,
        private budSco: BudgetScoreService,
        private badServ: BadgesEarnedService,
        private incServ: IncomeHistoryService,
        private savServ: SavingsHistoryService,
        private ts: TimeService,
        private catService: CategoryService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    
    var observArray = []
    if (this.catService.expenseCats == null || this.catService.incomeCats == null)
    {
        observArray.push(this.catService.getCategories())
    }
   
    const observable = forkJoin( observArray.concat([
    
        //Fetch Weekly and Monthly Budgets for the app:
        this.budServ.getSpendBudget(),

        //Fetch Default Display for Savings over Time Widget
        this.savServ.getByMonthCumSavings(),

        //Fetch Default Display for Spending over Time Widget
        this.spenTot.getByMonthCumSpendings(),

        //Fetch Default Display for Income over Time Widget
        this.incServ.getByMonthCumIncome(),

        this.incServ.getByMonthIncome(),

        this.spenTot.getByMonthSpendings(),

        this.spenTot.getSpendCatBreakdown(),

        this.incServ.getIncomeCatBreakdown(),

        //Fetch Income and Expense Budgets By Category
        this.budServ.getBudByCat(),

        //Fetch Weekly Spending Total
        this.spenTot.getCurWeekSpend(),

        //Fetch Badges
        this.badServ.getBadgesEarned(),

        //Fetch BudgetScore
        this.budSco.getBudgetScore()
    ]))

    return observable;
    
    }
}