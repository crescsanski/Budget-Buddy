import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.currentUserValue
        if (user) {
            // authorised so return true
            console.log("User: ", user)
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login-page'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}