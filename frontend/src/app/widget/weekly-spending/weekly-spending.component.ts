import { getSupportedInputTypes } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-weekly-spending',
  templateUrl: './weekly-spending.component.html',
  styleUrls: ['./weekly-spending.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class WeeklySpendingComponent implements OnInit {

  value: number = 0;
  weeklyBudget: number = 0;
  weeklySpent: number = 0;
  percentage: number = 0;


  constructor(private spenHis: SpendingHistoryService, private trigServ: TriggerService,
    private budServ: BudgetService) { 

    this.trigServ.expenReceiptAnnounced$.subscribe(() =>
    {
      this.ngOnInit();
    })

    this.trigServ.budgetUpdatedAnnounced$.subscribe(() =>
    {
      this.ngOnInit();
    })
    
  }

  ngOnInit(): void {
        //fetch value from database (calculate percentage)
        this.value = 0;
        this.weeklyBudget = Math.round(this.budServ.curBudCalcs.weeklyBudgetTotal);
     
        this.weeklySpent = this.spenHis.weekSpend;
        this.percentage = Math.round(this.weeklySpent/this.weeklyBudget *100);
  
     let interval = setInterval(() => {
      this.value = this.value + 10;
      if (this.value >= this.percentage) {
          this.value = this.percentage;
      }
  }, 70);
  }

}
