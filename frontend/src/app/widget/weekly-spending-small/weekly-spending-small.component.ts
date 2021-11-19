import { Component, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit(): void {
    //fetch value from database (calculate percentage)
   this.weeklyBudget = 300.00; //need to retreive via api
   this.weeklySpent = 125.98; //api retrieval

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