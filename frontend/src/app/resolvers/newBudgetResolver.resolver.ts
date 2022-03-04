import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { EMPTY, forkJoin, Observable } from "rxjs";
import { BadgesEarnedService } from "../services/badgesEarned.service";
import { BudgetService } from "../services/budget.service";
import { CategoryService } from "../services/category.service";
import { SpendingHistoryService } from "../services/spending-history.service";

@Injectable({ providedIn: 'root' })
export class NewBudgetResolver implements Resolve<any> {
    constructor(
        private catService: CategoryService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    
    var observArray = []
    if (this.catService.expenseCats == null || this.catService.incomeCats == null)
    {
        observArray.push(this.catService.getCategories())
    }

    const observable = forkJoin(observArray)

    if (observArray.length > 0)
    {
        return observable;
    }
    else
    {
        return {} as Observable<any>;
    }
  
    
    }
}