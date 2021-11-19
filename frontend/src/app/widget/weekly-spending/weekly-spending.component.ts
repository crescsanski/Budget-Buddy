import { Component, OnInit } from '@angular/core';

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


  constructor() { }


  ngOnInit(): void {
    //fetch value from database (calculate percentage)
   this.weeklyBudget = 300.00; //need to retreive via api
   this.weeklySpent = 125.98; //api retrieval
   this.percentage = Math.round(this.weeklySpent/this.weeklyBudget *100);

   let interval = setInterval(() => {
    this.value = this.value + 10;
    if (this.value >= this.percentage) {
        this.value = this.percentage;
    }
}, 70);




  }

}
