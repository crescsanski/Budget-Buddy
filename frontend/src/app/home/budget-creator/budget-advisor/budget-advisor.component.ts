import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { newBudgetPrompt } from './../../../models/newBudgetPrompt';


@Component({
  selector: 'app-budget-advisor',
  templateUrl: './budget-advisor.component.html',
  styleUrls: ['./budget-advisor.component.scss', './../../../widget/basic-widget/basic-widget.component.scss']
})
export class BudgetAdvisorComponent implements OnInit {
  data: any;
  options: any;
  needs: newBudgetPrompt[] = [];
  wants: newBudgetPrompt[] = [];
  debt: newBudgetPrompt[] = [];
  displayItems: newBudgetPrompt[] = [];
  title = '';

  @Output() pageForward  = new EventEmitter();

  nextPage() {
    this.pageForward.emit();
  }

  
  displayNeeds = false;

  constructor(private cs: CategoryService) { }

  ngOnInit() {
    this.data = {
        labels: ['Savings','Wants','Needs'],
        datasets: [
            {
                data: [20, 30, 50],
                backgroundColor: [
                    "#003486",
                    "#4ec5ca",
                    "#4eca9f"
                ],
                hoverBackgroundColor: [
                    "#00348680",
                    "#4ec5ca80",
                    "#4eca9f80"
                ]
            }
        ]
    };

    this.options = {
      datalabels: { display: false },
      responsive: false,
      maintainAspectRatio: false
    };

    this.wants = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "want");
    this.debt = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "saving");
    this.needs = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "need");

    /*
     this.wants =[
      {icon: '../../../../assets/icons/budget-icons/restaraunts.png', categoryTitle: 'Restaurants',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/entertainment.png', categoryTitle: 'Entertainment',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/furnishings.png', categoryTitle: 'Furnishings',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/non-essential-groceries.png', categoryTitle: 'Non-Essential Groceries',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Gifts',  amount: 0, type: 'Expense'},
  
    ]
    this.debt = [
      {icon: '../../../../assets/icons/budget-icons/investment.png', categoryTitle: 'Investment/Savings',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense',  amount: 0, type: 'Expense'},
    ];
    this.needs = [
      {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment', amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/utilities.png', categoryTitle: 'Utilities',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/insurance.png', categoryTitle: 'Insurance',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/medical.png', categoryTitle: 'Medical',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/pet.png', categoryTitle: 'Pets',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/housing.png', categoryTitle: 'Housing',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/transportation.png', categoryTitle: 'Transportation',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/essential-groceries.png', categoryTitle: 'Essential Groceries',  amount: 0, type: 'Expense'},
    ];
    */

  }

  setDisplay(selected) {
    this.displayItems = selected;
    if (this.displayItems == this.needs) {
      this.title = '50% Needs';
    } else if (this.displayItems == this.debt) {
      this.title = '20% Savings';
    } else  if (this.displayItems == this.wants) {
      this.title = '30% Wants';
    } else {
      this.title = 'Error'
    }
    this.displayNeeds = true;
  }

}
