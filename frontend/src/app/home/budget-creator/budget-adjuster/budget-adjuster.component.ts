import { newBudgetPrompt } from './../../../models/newBudgetPrompt';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/app/models/budget';
import { Router } from '@angular/router';


@Component({
  selector: 'app-budget-adjuster',
  templateUrl: './budget-adjuster.component.html',
  styleUrls: ['./budget-adjuster.component.scss', './../../../widget/basic-widget/basic-widget.component.scss']
})
export class BudgetAdjusterComponent implements OnInit {
  stackedData: any;
  stackedOptions: any;
  wantsValue: number = 0;
  loading: boolean = false;
  needsValue: number = 0;
  debtValue: number = 0;
  dropdownPrompts = [];
  max: number = 0;
  wantsRecommend = 0;
  needsRecommend = 0;
  debtRecommend = 0;

  actualWantsPercent=0;
  actualNeedsPercent=0;
  actualDebtPercent=0;

  errorValue = 0;
  errorPercent = 0;
  errorDifference = 0;
  errorCategory = '';

  overBudget: boolean = false;

  categories = ['want', 'need', 'saving']

  selectedCategory = "";

  @Input() prompts: newBudgetPrompt[];
  @Input() dat: any;
  @Input() totalIncome: number;
  @Input() totalExpenses: number;
  @Input() incomes: any[];
  @Input() expenses: any[];
  @Input() availableBudget: number;
  @Input() breakdown: {want: number, need: number, debt: number}
  @ViewChild('chart') chart: UIChart; 

  constructor(private budServ: BudgetService, private router: Router) { }

  onChange(){
    //this.dropdownPrompts = [];
    this.expenses.forEach(x => {
      if(x.category  == (this.selectedCategory.toLowerCase())) {
        //this.dropdownPrompts.push(x);
        x.visible = true;
      }
      else
      {
        x.visible = false;
      }
  });
  }

  ngOnInit(): void {

    this.recalculate();
    this.max = this.availableBudget;


    this.stackedData = {
      labels: ['My Budget Breakdown'],
      datasets: [{
          type: 'bar',
          label: 'Needs',
          backgroundColor: '#4ec5ca',
          data: [this.breakdown.need]
      }, {
          type: 'bar',
          label: 'Wants',
          backgroundColor: '#003486',
          data: [this.wantsValue]
      }, {
          type: 'bar',
          label: 'Savings',
          backgroundColor: '#4eca9f',
          data: [this.debtValue]
      }, {
        type: 'bar',
        label: 'Available',
        backgroundColor: '#00000020',
        data: [this.availableBudget]
    }]
  };

  


 this.stackedOptions = {
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {display: true}
            },
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#00000000'
                    },
                    grid: {
                        color: 'white'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#003486'
                    },
                    grid: {
                        color: 'white'
                    }
                }
            }
        };
    }

    recalculate(){
      this.wantsValue = 0;
      this.debtValue = 0;
      this.needsValue = 0;

      this.expenses.forEach(x => {
         if(x.category == 'saving') {
            this.debtValue += x.amount;
          } else if (x.category == 'want'){
            this.wantsValue += x.amount;

          } else if (x.category == 'need'){
            this.needsValue += x.amount;

          }
      });
      this.breakdown = {want: this.wantsValue, need: this.needsValue, debt: this.debtValue}
      this.totalExpenses = this.debtValue + this.wantsValue + this.needsValue;
      this.availableBudget = this.totalIncome-this.totalExpenses;
      this.max = this.availableBudget;
      if (this.max >= 0)
      {
        this.expenses.forEach(x => {
          x.max = x.amount + this.max;
       });
      }
      else
      {
        this.expenses.forEach(x => {
          x.max = x.amount;
       });
      }
 
    }

    getErrPerc(x: number): number
    {
      return Math.round(x);
    }
  
    update(event: Event) {
      this.recalculate();
      this.makeRecommendations();
       this.stackedData = {
         labels: ['Budget'],
        datasets: [{
          type: 'bar',
          label: 'Needs',
          backgroundColor: '#4ec5ca',
          data: [this.breakdown.need]
      }, {
          type: 'bar',
          label: 'Wants',
          backgroundColor: '#003486',
          data: [this.breakdown.want]
      }, {
          type: 'bar',
          label: 'Savings',
          backgroundColor: '#4eca9f',
          data: [this.breakdown.debt]
      }, {
        type: 'bar',
        label: 'Available',
        backgroundColor: '#00000020',
        data: [this.availableBudget]
    }]}
  }

  submit()
  {
    this.loading = true;
    var post: Budget[] = []
    this.incomes.forEach((obj) =>
    {
      post.push({category: obj.category_id, 
      user_category_budget_estimated_amount: obj.amount,
    user_category_budget_altered_amount: obj.amount});
    })
    this.expenses.forEach((obj) =>
      {
        post.push({category: obj.category_id, 
          user_category_budget_estimated_amount: obj.amount,
        user_category_budget_altered_amount: obj.amount});
      })
    
    this.budServ.setInitialBudget(post).subscribe((val) =>
    {
      if (val != "error")
      {
        this.router.navigate(['main-page'], {state: {newUser: true}})
      }
    })
  }

  makeRecommendations(){
    this.wantsRecommend = this.totalIncome *this.dat.want;
    this.needsRecommend = this.totalIncome *this.dat.need;
    this.debtRecommend = this.totalIncome *this.dat.saving;

    this.actualWantsPercent = this.breakdown.want/this.totalIncome
    this.actualNeedsPercent = this.breakdown.need/this.totalIncome
    this.actualDebtPercent = this.breakdown.debt/this.totalIncome

    if(this.actualWantsPercent>this.dat.want) {
      this.overBudget = true;
      this.errorCategory = "wants"
      this.errorPercent = (this.actualWantsPercent-this.dat.want) *100;
      this.errorValue = this.breakdown.want;
      this.errorDifference = this.breakdown.want-this.wantsRecommend;
    } else if(this.actualNeedsPercent>this.dat.need) {
      this.overBudget = true;
      this.errorCategory = "needs"
      this.errorPercent = (this.actualNeedsPercent - this.dat.need)*100;
      this.errorValue = this.breakdown.need;
      this.errorDifference = this.breakdown.need-this.needsRecommend;
    } else if(this.actualDebtPercent>this.dat.saving) {
      this.overBudget = true;
      this.errorCategory = "savings"
      this.errorPercent = (this.actualDebtPercent-this.dat.saving) *100;
      this.errorValue = this.breakdown.debt;
      this.errorDifference = this.breakdown.debt-this.debtRecommend;
    }

  }

    



  }


