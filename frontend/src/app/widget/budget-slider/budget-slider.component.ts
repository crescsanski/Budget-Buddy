import { Budget } from 'src/app/models/budget';
import { BudgetCategory } from '../../models/formModels/budgetCategory';
import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-budget-slider',
  templateUrl: './budget-slider.component.html',
  styleUrls: [ './budget-slider.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class BudgetSliderComponent implements OnInit {
  budgetCategories: Budget[];
  curTotalBudget: number = 2000;
  maxTotalBudget: number;
  show: boolean = false; //whether to display buttons
  refresh: boolean = true;
  tempValue = 0;
  
  constructor(private budServ: BudgetService, private ts: TimeService, private trigServ: TriggerService) { 
    this.trigServ.budgetUpdatedAnnounced$.subscribe(() =>
    {
      this.ngOnInit();
      this.show = false;
    })
  }

  ngOnInit(): void {
    
    this.curTotalBudget = this.budServ.curBudCalcs.monthlyBudgetTotal;
    this.maxTotalBudget = this.budServ.curBudCalcs.monthlyEstIncome;

    this.tempValue = 0;

    this.budgetCategories = this.budServ.exBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month).sort((a, b) => (a.category_id > b.category_id) ? 1 : -1)

    this.refreshNewValues();

    this.updateMaxes();
    /*
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
    */
   }

   getConfigTotal(): number
   {
     let total = this.budgetCategories.reduce(function (accumulator, item) {
       return accumulator + item.new_amount;
     }, 0);

     return total;
   }

   sliderChange()
   {
     this.updateMaxes();
     this.show = true;
   }

   getWants()
   {
     return this.budgetCategories.filter(val => val.category_type == "want")
   }

   getNeeds()
   {
     return this.budgetCategories.filter(val => val.category_type == "need")
   }

   getSavings()
   {
     return this.budgetCategories.filter(val => val.category_type == "saving")
   }

   getCurBreakDown(): {want: number, need: number, debt: number}
   {
      var want = 0;
      var need = 0;
      var debt = 0;
      for (let bud of this.budgetCategories)
      {
        switch (bud.category_type)
        {
          case "want": 
            want += bud.new_amount;
            break;
          case "need":
            need += bud.new_amount;
            break;
          case "saving":
            debt += bud.new_amount;
            break;
        }
      }

      return {want: want, need: need, debt: debt}
   }

   updateMaxes()
   {
    
    let available = this.maxTotalBudget - this.getConfigTotal();
    for (let bud in this.budgetCategories)
    {
      let cur = this.budgetCategories[bud].new_amount
      this.budgetCategories[bud].max = available + cur;
    }
   }

   refreshNewValues()
   {
    for (let bud in this.budgetCategories)
    {
      this.budgetCategories[bud].new_amount = this.budgetCategories[bud].altered_amount;
    }
   }

   reset()
   {
     this.refreshNewValues();
     this.updateMaxes();
     this.show = false;
   }

   updateVisibility(): void {
    this.refresh = false;
    setTimeout(() => this.refresh = true, 0);
  }

  applyChanges()
  {
    var budCopy: Budget[] = JSON.parse(JSON.stringify(this.budgetCategories))
    let send: any[] = []
    for (let i in budCopy)
    {
      send.push({category: budCopy[i].category_id, 
        user_category_budget_altered_amount: budCopy[i].new_amount})
    }

    this.budServ.updateBudget(send).subscribe((
      (val: string) => {
        if (val != "error")
        {
          this.trigServ.announceBudgetUpdate();
        }
      }
    ))
  }



  }


