import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-weekly-spending-small',
  templateUrl: './weekly-spending-small.component.html',
  styleUrls: ['./weekly-spending-small.component.scss', './../small-widget/small-widget.component.scss']
})
export class WeeklySpendingSmallComponent implements OnInit {

  value: number = 0;
  weeklyBudget: number = 0;
  weeklySpent: number = 0;
  status: string = "error loading status";


  constructor(private budServ: BudgetService,
    private spenHis: SpendingHistoryService, private trigServ: TriggerService) { 
      this.trigServ.expenReceiptAnnounced$.subscribe(() =>
    {
      this.ngOnInit();
    })
    }

  ngOnInit(): void {
    //fetch value from database (calculate percentage)
   this.weeklyBudget = this.budServ.spendBudCalcs.curWeekSpenBudget; //need to retreive via api
   this.weeklySpent = this.spenHis.weekSpend; //api retrieval

   let interval = setInterval(() => {
    this.value = this.value + Math.floor(this.weeklySpent/10);
    if (this.value >= this.weeklySpent) {
        this.value = this.weeklySpent;
    }
  }, 100);

  this.pickMessage();


  }

  pickMessage() {
    if(this.weeklyBudget>this.weeklySpent){
      this.status = "Under budget!"
    } else if (this.weeklyBudget < this.weeklySpent) {
      this.status = "Over budget!"
    } else if (this.weeklyBudget == this.weeklySpent){
      this.status = "Right on track!"
  }


  }
}