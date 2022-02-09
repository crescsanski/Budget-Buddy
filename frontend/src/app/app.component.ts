import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { WidgetService } from './widget/widget.service';
import { CategoryService } from './services/category.service';
import { BudgetService } from './services/budget.service';
import { SpendingHistoryService } from './services/spending-history.service';
import { BadgesEarnedService } from './services/badgesEarned.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  user: User | null = null;

  constructor(private authServ: AuthService, 
    private budServ: BudgetService,
    private spenTot: SpendingHistoryService,
    private badServ: BadgesEarnedService,
    private catService: CategoryService)
  {
    this.authServ.currentUser.subscribe(x => this.user = <User>x);

  }

  cleanLogout() {
    this.authServ.cleanLogout().subscribe();
  }
}


