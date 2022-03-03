import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service'
import { BudgetService } from '../services/budget.service';
import { CategoryService } from '../services/category.service';
import { TimeService } from '../services/time.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private budgServ: BudgetService,
        private catServ: CategoryService,
        private timeServ: TimeService
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.currentUserValue
        if (user && user.token) {
            // authorised so return true
            console.log("User: ", user)
            return true;
        }
      //  else
      //  {
              // not logged in so redirect to login page
                this.router.navigate(['login-page']);
                return false;
      //  }
        /*
        if (!(this.budgServ.exBudByCat && this.budgServ.inBudByCat))
        {
            await this.fetchBudgets();
        }
        if (!(this.catServ.expenseCats && this.catServ.incomeCats))
        {
            await this.fetchCats();
        }
        let curExBud = this.budgServ.exBudByCat.filter(value => value.year == this.timeServ.year 
            && value.month == this.timeServ.month)
        
        let curInBud = this.budgServ.inBudByCat.filter(value => value.year == this.timeServ.year 
            && value.month == this.timeServ.month)
        if (curExBud.length == this.catServ.expenseCats.length && curInBud.length == this.catServ.incomeCats.length)
        {
            return true;
        }       
        //User has logged in, but has an expired budget.  The user must be redirected back to the 
        //budget initialization page.
        this.router.navigate(['new-budget']);
        return false;
        */
      
    }

    async fetchBudgets()
    {
        return await this.budgServ.getBudByCat().toPromise();
    }

    async fetchCats()
    {
        return await this.catServ.getCategories().toPromise();
    }
}