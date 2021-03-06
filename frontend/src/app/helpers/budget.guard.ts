import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Budget } from '../models/budget';
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
        const user = this.authService.currentUserValue
        if (user && user.token) {
        return this.budgServ.getBudByCat().pipe(
            map((val: Budget[]) => {
                let cur = val.filter(value => value.year == this.timeServ.year 
                    && value.month == this.timeServ.month)
                if (cur.length == 23)
                {
                    return true;
                }
                this.router.navigate(['new-budget']);
                return false;
            })
        )}
             // not logged in so redirect to login page
             this.router.navigate(['login-page']);
             return false;
    } 
    

 
}