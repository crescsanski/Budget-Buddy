import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.accountService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
}