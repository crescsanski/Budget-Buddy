import { BudgetCategory } from './../../models/formModels/budgetCategory';
import { Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { MessageService } from 'src/app/services/message.service';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  pageLabel: String = '';
  currentPage: String = '';
  settings: MenuItem[] = [];
  dashboardWidgets: any[] | undefined;
  budgetWidgets: any[] | undefined;
  trackingWidgets: any[] | undefined;
  analyticsWidgets: any[] | undefined;
  rewardsWidgets: any[] | undefined;
  roomWidgets: any[] | undefined;
  hidden: boolean = true;
  name: string = undefined;
  level: number = undefined;
  favoriteMenu: boolean = false;
  budgetCategories: any[];
  selectedCategories: any[];



  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { 
   this.currentPage = 'Dashboard';
   //this.currentPage = 'Tracking';
  }

  ngOnInit(): void {
    this.settings = [
      { label: 'New', icon: 'pi pi-fw pi-plus'},
      { label: 'Open', icon: 'pi pi-fw pi-download'},
      { label: 'Undo', icon: 'pi pi-fw pi-refresh'}
  ];

  //obtain list of widgets via http request
    this.dashboardWidgets = [
     //retrieve list of dashboard widgets
    ]

    this.budgetWidgets = [
      { size: 'large', title: 'Breakdown', image: '../../assets/prototype-images/bar-graph.png' },
      { size: 'large', title: 'Net Income', image: '../../assets/prototype-images/pie-chart.png', button: 'Add Income' },
      { size: 'small', title: 'Weekly Budget Manager', image: '../../assets/prototype-images/budget-breakdown.png' },
      { size: 'small', title: 'Income', image: '../../assets/prototype-images/income-breakdown.png' }
    ]

    this.trackingWidgets = [
     //retrieve list of tracking widgets
    ]

    this.analyticsWidgets = [
      { size: 'large', title: 'Savings', image: '../../assets/prototype-images/line-graph.png' },
      { size: 'large', title: 'Total Spending', image: '../../assets/prototype-images/spending-progress-bar.png' },
      { size: 'large', title: 'Net Income', image: '../../assets/prototype-images/pie-chart.png' },
      { size: 'small', title: 'Report Card', image: '../../assets/prototype-images/report-card.png' },
      { size: 'small', title: 'Top 3: Spending', image: '../../assets/prototype-images/top-3-spending.png' }
    ]

    this.rewardsWidgets = [
      { size: 'large', title: 'Trophies', image: '../../assets/prototype-images/rewards-panel.png' },
      { size: 'large', title: 'Progress', image: '../../assets/prototype-images/badges-progress.png' },
      { size: 'small', title: 'Badges', image: '../../assets/prototype-images/line-graph.png' },
    ]

    this.roomWidgets = [
      { size: 'large', title: '', image: '../../assets/prototype-images/room.png' },
      
    ]

    this.budgetCategories = [

        {icon: '../../../../assets/icons/budget-icons/job-income.png', categoryTitle: 'Job Income',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Received Gift',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/interest.png', categoryTitle: 'Interest',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/gov-payment.png', categoryTitle: 'Government Payment',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/tax-refund.png', categoryTitle: 'Tax Refund',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Income',  amount: 0, type: 'Income'},
        {icon: '../../../../assets/icons/budget-icons/housing.png', categoryTitle: 'Housing',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/transportation.png', categoryTitle: 'Transportation',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/essential-groceries.png', categoryTitle: 'Essential Groceries',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/non-essential-groceries.png', categoryTitle: 'Non-Essential Groceries',  amount: 0, type: 'Expense'},
          {icon: '../../../../assets/icons/budget-icons/utilities.png', categoryTitle: 'Utilities',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/insurance.png', categoryTitle: 'Insurance',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/medical.png', categoryTitle: 'Medical',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/investment.png', categoryTitle: 'Investment',  amount: 0, type: 'Expense', category: 'debt'},
          {icon: '../../../../assets/icons/budget-icons/restaraunts.png', categoryTitle: 'Restaurants',  amount: 0, type: 'Expense', category: 'want'},
          {icon: '../../../../assets/icons/budget-icons/entertainment.png', categoryTitle: 'Entertainment',  amount: 0, type: 'Expense', category: 'want'},
          {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing',  amount: 0, type: 'Expense', category: 'want'},
          {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Gifts',  amount: 0, type: 'Expense', category: 'want'},
          {icon: '../../../../assets/icons/budget-icons/furnishings.png', categoryTitle: 'Furnishings',  amount: 0, type: 'Expense', category: 'want'},
          {icon: '../../../../assets/icons/budget-icons/pet.png', categoryTitle: 'Pets',  amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment', amount: 0, type: 'Expense', category: 'need'},
          {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense',  amount: 0, type: 'Expense', category: 'debt'}
    ];

    this.selectedCategories = [];
    
  }

  onNotify(page:string) {
    this.currentPage = page;
  }

  toggleHidden() {
    this.hidden = !this.hidden;
  }

  cleanLogout() {
    this.authService.cleanLogout().pipe(first())
    .subscribe({
        next: () => {
            this.messageService.addSuccess('Logout successful', "");
        },
        error: error => {
            for (const key in error)
            {
              this.messageService.addError(`Logout error: ${key}`, error[key]);
            }
        }
    });
  }

  
 

  goToNewBudget(){
    this.router.navigateByUrl('/new-budget')
  }

  showFavorites(){
    this.favoriteMenu = true;
  }

  setFavorites(){
    this.favoriteMenu = false;
    //TODO: API TO SET FAVORITES
  }


}
