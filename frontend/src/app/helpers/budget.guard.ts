import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { BudgetCategory } from '../models/formModels/budgetCategory';

import { AuthService } from '../services/auth.service'
import { BudgetService } from '../services/budget.service';
import { CategoryService } from '../services/category.service';
import { TimeService } from '../services/time.service';

@Injectable({ providedIn: 'root' })
export class BudgetGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private budgServ: BudgetService,
        private catServ: CategoryService,
        private timeServ: TimeService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
        return this.budgServ.getBudByCat().pipe(
            map((val: BudgetCategory[]) => {
                let cur = val.filter(value => value.year == this.timeServ.year 
                    && value.month == this.timeServ.month)
                if (cur.length == 23)
                {
                    return true;
                }
                this.router.navigateByUrl('/new-budget');
                return false;
            })
        )        
    } 
    

 
}