import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { WidgetService } from './widget/widget.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  user: User | null = null;

  constructor(private authServ: AuthService, private catService: CategoryService)
  {
    this.authServ.currentUser.subscribe(x => this.user = <User>x);

    //Fetch categories for the app:
    this.catService.getIncomeCategories().subscribe();
    this.catService.getSpendingCategories().subscribe();

  }

  preFetchData(): Boolean
  {
    return (this.catService.expenseCats != null) && (this.catService.incomeCats != null);
  }

  cleanLogout() {
    this.authServ.cleanLogout().subscribe();
  }
}


