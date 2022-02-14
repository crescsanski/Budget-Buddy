import { newBudgetPrompt } from './../../../models/newBudgetPrompt';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';


@Component({
  selector: 'app-budget-adjuster',
  templateUrl: './budget-adjuster.component.html',
  styleUrls: ['./budget-adjuster.component.scss', './../../../widget/basic-widget/basic-widget.component.scss']
})
export class BudgetAdjusterComponent implements OnInit {
  stackedData: any;
  stackedOptions: any;
  wantsValue: number = 0;
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

  overBudget: boolean = true;

  categories = ['want', 'need', 'debt']

  selectedCategory = "";

  @Input() prompts: newBudgetPrompt[];
  @Input() totalIncome: number;
  @Input() totalExpenses: number;
  @Input() availableBudget: number;
  @Input() breakdown: {want: number, need: number, debt: number}
  @ViewChild('chart') chart: UIChart; 

  constructor() { }

  onChange(){
    this.dropdownPrompts = [];
    this.prompts.forEach(x => {
      if(x.category  == (this.selectedCategory.toLowerCase())) {
        this.dropdownPrompts.push(x);
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
          label: 'Debt',
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

      this.prompts.forEach(x => {
         if(x.category == 'debt') {
            this.debtValue += x.amount;
          } else if (x.category == 'want'){
            this.wantsValue += x.amount;

          } else if (x.category == 'need'){
            this.needsValue += x.amount;

          }
      });
      this.totalExpenses = this.debtValue + this.wantsValue + this.needsValue;
      this.availableBudget = this.totalIncome-this.totalExpenses;
      this.max = this.availableBudget;
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
          label: 'Debt',
          backgroundColor: '#4eca9f',
          data: [this.breakdown.debt]
      }, {
        type: 'bar',
        label: 'Available',
        backgroundColor: '#00000020',
        data: [this.availableBudget]
    }]}
  }

  makeRecommendations(){
    this.wantsRecommend = this.totalIncome *.30;
    this.needsRecommend = this.totalIncome *.50;
    this.debtRecommend = this.totalIncome *.20;

    this.actualWantsPercent = this.breakdown.want/this.totalIncome
    this.actualNeedsPercent = this.breakdown.need/this.totalIncome
    this.actualDebtPercent = this.breakdown.debt/this.totalIncome

    if(this.actualWantsPercent>.3) {
      this.overBudget = true;
      this.errorCategory = "wants"
      this.errorPercent = this.actualWantsPercent *100;
      this.errorValue = this.breakdown.want;
      this.errorDifference = this.breakdown.want-this.wantsRecommend;
    } else if(this.actualNeedsPercent>.3) {
      this.overBudget = true;
      this.errorCategory = "needs"
      this.errorPercent = this.actualNeedsPercent *100;
      this.errorValue = this.breakdown.need;
      this.errorDifference = this.breakdown.need-this.needsRecommend;
    } else if(this.actualDebtPercent>.3) {
      this.overBudget = true;
      this.errorCategory = "wants"
      this.errorPercent = this.actualDebtPercent *100;
      this.errorValue = this.breakdown.debt;
      this.errorDifference = this.breakdown.debt-this.debtRecommend;
    }

  }

    



  }


