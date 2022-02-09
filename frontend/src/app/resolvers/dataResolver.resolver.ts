import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { BadgesEarnedService } from "../services/badgesEarned.service";
import { BudgetService } from "../services/budget.service";
import { CategoryService } from "../services/category.service";
import { SpendingHistoryService } from "../services/spending-history.service";

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
    constructor(private budServ: BudgetService,
        private spenTot: SpendingHistoryService,
        private badServ: BadgesEarnedService,
        private catService: CategoryService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    
    var observArray = []
    if (this.catService.expenseCats == null)
    {
        observArray.push(this.catService.getSpendingCategories())
    }
    if (this.catService.incomeCats == null)
    {
        observArray.push(this.catService.getIncomeCategories())
    }
    const observable = forkJoin( observArray.concat([
    
        //Fetch Weekly and Monthly Budgets for the app:
        this.budServ.getSpendBudget(),

        //Fetch Income and Expense Budgets By Category
        this.budServ.getExBudByCat(),
        this.budServ.getInBudByCat(),

        //Fetch Weekly Spending Total
        this.spenTot.getCurWeekSpend(),

        //Fetch Badges
        this.badServ.getBadgesEarned(),
    ]))

    return observable;
    
    }
}