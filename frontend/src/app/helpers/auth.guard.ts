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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.currentUserValue
        if (user && user.token) {
            // authorised so return true
            console.log("User: ", user)
            return true;
        }
   
              // not logged in so redirect to login page
                this.router.navigate(['login-page']);
                return false;

    }
}