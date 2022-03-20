import { Budget } from 'src/app/models/budget';
import { BudgetCategory } from '../../models/formModels/budgetCategory';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';
import { BudgetBreakdownChartComponent } from '../budget-breakdown-chart/budget-breakdown-chart.component';
import { Category } from 'src/app/models/category';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-budget-slider',
  templateUrl: './budget-slider.component.html',
  styleUrls: [ './budget-slider.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class BudgetSliderComponent implements OnInit {

  @ViewChild('chart') chart: BudgetBreakdownChartComponent;

  budgetCategories: Budget[];
  filteredCats: Budget[];
  curTotalBudget: number = 2000;
  configTotal: number;
  actualBreakdown: {want: number, need: number, debt: number}
  percenUsed: number;
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
    this.configTotal = this.curTotalBudget;
    this.maxTotalBudget = this.budServ.curBudCalcs.monthlyEstIncome;

    this.tempValue = 0;

    this.budgetCategories = this.budServ.exBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month)
      .map(val => {
        val.visible = val.is_favorite;
        return val;})
      .sort((a, b) => (a.category_id > b.category_id) ? 1 : -1)
    this.filteredCats = this.budgetCategories.filter(val => val.visible);
    
    this.refreshNewValues();

    this.updateParameters( this.curTotalBudget);

    this.actualBreakdown = this.getCurBreakDown();

   }

   updateParameters(total: number)
   {
    this.updateMaxes(total);

    this.updatePercenUsed(total);
   }

  updateCategories()
  {
    this.budgetCategories.forEach((val) => {
      if (this.filteredCats.find(val2 => val2.category_id == val.category_id))
      {
        val.visible = true;
      }
      else
      {
        val.visible = false;
      }
    })
  }

 getConfigTotal(): number
   {
     return this.budgetCategories.reduce(function (accumulator, item) {
       return accumulator + item.new_amount;
     }, 0);
   }

   sliderChange()
   {
     console.log("Slider value has been changed")
     this.configTotal = this.getConfigTotal();
     //this.updateMaxes(this.configTotal);
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

   getCurBreakDown(): any
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

   updateMaxes(total: number)
   {
    let available = this.maxTotalBudget - total;
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
     this.updateVisibility();
     this.show = false;
   }

   updateVisibility(): void {
    this.refresh = false;
    this.configTotal = this.getConfigTotal();
    this.updateParameters(this.configTotal);
    this.chart.refresh(this.getCurBreakDown()); //refresh chart
    setTimeout(() => this.refresh = true, 0);
  }

  updatePercenUsed(total: number): void {
    this.percenUsed = Math.round(total/this.maxTotalBudget * 100);
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


