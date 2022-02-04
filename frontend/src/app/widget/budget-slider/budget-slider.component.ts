import { Budget } from 'src/app/models/budget';
import { BudgetCategory } from '../../models/formModels/budgetCategory';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budget-slider',
  templateUrl: './budget-slider.component.html',
  styleUrls: [ './budget-slider.component.scss', './../small-widget/small-widget.component.scss']
})
export class BudgetSliderComponent implements OnInit {
  budgetCategories: BudgetCategory[];
  totalBudget: number;
  tempValue = 0;
  
  constructor() { }

  ngOnInit(): void {
    
    this.totalBudget = 1000;
    this.tempValue = 0;

    this.budgetCategories = [
      {categoryTitle: 'Housing', amount: 700, visible: true},
      {categoryTitle: 'Transportation', amount: 200, visible: true},
      {categoryTitle: 'Essential Groceries', amount: 200, visible: true},
      {categoryTitle: 'Non-Essential Groceries', amount: 80, visible: true},
      {categoryTitle: 'Utilities', amount: 150, visible: true},
      {categoryTitle: 'Insurance', amount: 120, visible: true},
      {categoryTitle: 'Medical', amount: 200, visible: true},
      {categoryTitle: 'Investment', amount: 80, visible: true},
      {categoryTitle: 'Restaurants', amount: 140, visible: true},
      {categoryTitle: 'Entertainment', amount: 120, visible: true},
      {categoryTitle: 'Clothing', amount: 50, visible: true},
      {categoryTitle: 'Gifts', amount: 40, visible: true},
      {categoryTitle: 'Furnishings', amount: 0, visible: true},
      {categoryTitle: 'Pets', amount: 50, visible: true},
      {categoryTitle: 'Tax Payment', amount: 25, visible: true},
      {categoryTitle: 'Miscellaneous Expense', amount: 200, visible: true},
    ]
   }



  }

