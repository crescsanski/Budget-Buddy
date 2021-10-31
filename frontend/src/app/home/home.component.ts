import { MenuComponent } from './main-page/menu/menu.component';
import { Component } from '@angular/core';

import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(private authService: AuthService) {
        this.user = <User>this.authService.currentUserValue;
    }
}