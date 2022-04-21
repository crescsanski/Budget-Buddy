import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RouteConfigLoadEnd } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ColorService } from 'src/app/services/color.service';
import { newBudgetPrompt } from './../../../models/newBudgetPrompt';
import {Chart, ChartItem} from 'chart.js';

@Component({
  selector: 'app-budget-advisor',
  templateUrl: './budget-advisor.component.html',
  styleUrls: ['./budget-advisor.component.scss', './../../../widget/basic-widget/basic-widget.component.scss']
})
export class BudgetAdvisorComponent implements OnInit {
  data: any;
  data2: any;
  options: any;
  options2: any;
  load: boolean = false;
  displayType: string;
  needs: newBudgetPrompt[] = [];
  wantIcons: any;
  needIcons: any;
  debtIcons: any;
  wants: newBudgetPrompt[] = [];
  debt: newBudgetPrompt[] = [];
  displayItems: newBudgetPrompt[] = [];
  title = '';

  @Output() pageForward  = new EventEmitter();

  @Input() dat: any;

  nextPage() {

      this.pageForward.emit();
   

  }

  
  displayNeeds = false;

  constructor(public cp: CurrencyPipe, private colServ: ColorService, private cs: CategoryService, private pp: PercentPipe) { 

  }

  ngOnInit(): void {
   
    console.log("Breakdown: " + this.dat)
    this.data = {
        labels: ['Needs', 'Wants', 'Savings'],
        datasets: [
            {
                data: [(this.dat.need * 100), (this.dat.want * 100), (this.dat.saving * 100)],
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

    if (!this.dat.default)
    {
      let labels = ['Housing', 'Transportation', 'Food/Grocery Essential', 'Medical', 'Utilities', 'Debt Payment',
      'Insurance', 'Lifestyle Essential', 'Pet', 'Tax Payment', 'Miscellaneous Expense Essential']
      let yValues = [this.dat['Housing'].amount, this.dat['Transportation'].amount,
      this.dat['Food/Grocery Essential'].amount, this.dat['Medical'].amount, 
    this.dat['Utilities'].amount, this.dat['Debt Payment'].amount,
  this.dat['Insurance'].amount, this.dat['Lifestyle Essential'].amount,
  this.dat['Pet'].amount, this.dat['Tax Payment'].amount, this.dat['Miscellaneous Expense Essential'].amount]
  
      this.data2 = {
        labels: labels,
        datasets: [
            {
                data: yValues,
        backgroundColor: this.colServ.configureDefaultColors(yValues),
      hoverBackgroundColor: this.colServ.configureDefaultColors(yValues)
      }
        ]
    };
  
      let cp = this.cp
      let pp = this.pp
      let dat = this.dat
  
      this.options2 = {
  
        plugins: {
          tooltip: {
            enabled: true,
            titleFont: 
            {
              size: 30
            },
            bodyFont: {
              size: 30
            },
            callbacks: {
                label: function(context) {
                    let lab = labels[context.dataset.index]
                    let val: number = yValues[context.dataset.index]
                    return [context.label, "Amount: " + cp.transform(context.raw), 
                    "Percentage: " + pp.transform(dat[context.label].percen)] 
                }
              }
            }
        }
      }
    }



    this.options = {
      plugins: {
        datalabels: { display: false },
      },  
      responsive: false,
      maintainAspectRatio: false
    };

    this.wantIcons ={
      'Restaurants': {icon: '../../../../assets/icons/budget-icons/restaraunts.png', categoryTitle: 'Restaurants',  amount: 0, type: 'Expense'},
      'Entertainment': {icon: '../../../../assets/icons/budget-icons/entertainment.png', categoryTitle: 'Entertainment',  amount: 0, type: 'Expense'},
      'Lifestyle Non-Essential': {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing',  amount: 0, type: 'Expense'},
      'Furnishings': {icon: '../../../../assets/icons/budget-icons/furnishings.png', categoryTitle: 'Furnishings',  amount: 0, type: 'Expense'},
      'Food/Grocery Non-Essential': {icon: '../../../../assets/icons/budget-icons/non-essential-groceries.png', categoryTitle: 'Non-Essential Groceries',  amount: 0, type: 'Expense'},
      'Gift': {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Gifts',  amount: 0, type: 'Expense'},
      'Miscellaneous Expense Non-Essential': {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense',  amount: 0, type: 'Expense'},
  
     }
    this.debtIcons = {
      'Investment/Savings': {icon: '../../../../assets/icons/budget-icons/investment.png', categoryTitle: 'Investment/Savings',  amount: 0, type: 'Expense'},
    };
    this.needIcons = {
      'Tax Payment': {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment', amount: 0, type: 'Expense'},
      'Debt Payment': {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment', amount: 0, type: 'Expense'},
      'Utilities': {icon: '../../../../assets/icons/budget-icons/utilities.png', categoryTitle: 'Utilities',  amount: 0, type: 'Expense'},
      'Insurance': {icon: '../../../../assets/icons/budget-icons/insurance.png', categoryTitle: 'Insurance',  amount: 0, type: 'Expense'},
      'Medical': {icon: '../../../../assets/icons/budget-icons/medical.png', categoryTitle: 'Medical',  amount: 0, type: 'Expense'},
      'Pet': {icon: '../../../../assets/icons/budget-icons/pet.png', categoryTitle: 'Pets',  amount: 0, type: 'Expense'},
      'Lifestyle Essential': {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing',  amount: 0, type: 'Expense'},
      'Housing': {icon: '../../../../assets/icons/budget-icons/housing.png', categoryTitle: 'Housing',  amount: 0, type: 'Expense'},
      'Transportation': {icon: '../../../../assets/icons/budget-icons/transportation.png', categoryTitle: 'Transportation',  amount: 0, type: 'Expense'},
      'Food/Grocery Essential': {icon: '../../../../assets/icons/budget-icons/essential-groceries.png', categoryTitle: 'Essential Groceries',  amount: 0, type: 'Expense'},
      'Miscellaneous Expense Essential': {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense',  amount: 0, type: 'Expense'},
    };

    this.wants = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "want")
      .map(obj => ({...obj, icon: this.wantIcons.hasOwnProperty(obj.category_name) ? this.wantIcons[obj.category_name].icon : undefined}));
    this.debt = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "saving")
      .map(obj => ({...obj, icon: this.debtIcons.hasOwnProperty(obj.category_name) ? this.debtIcons[obj.category_name].icon : undefined}));
    this.needs = this.cs.expenseCats.map(obj => ({...obj, visible: true, max: 0, 
        target: this.dat.hasOwnProperty(obj.category_name) ? this.dat[obj.category_name].amount : undefined, 
        break: this.dat.hasOwnProperty(obj.category_name) ? this.dat[obj.category_name].percen : undefined,
         amount: 0, category: obj.category_type, categoryTitle: obj.category_name})).filter(obj => obj.category_type == "need")
         .map(obj => ({...obj, icon: this.needIcons.hasOwnProperty(obj.category_name) ? this.needIcons[obj.category_name].icon : undefined}));

    

    

    this.load = true;

  }

  setDisplay(selected) {
    this.displayItems = selected;
    if (this.displayItems == this.needs) {
      this.displayType = "need"
      this.title = this.pp.transform(this.dat.need) + ' Needs';
    } else if (this.displayItems == this.debt) {
      this.displayType = "saving"
      this.title = this.pp.transform(this.dat.saving) + " Savings";
    } else  if (this.displayItems == this.wants) {
      this.displayType = "want"
      this.title = this.pp.transform(this.dat.want) + ' Wants';
    } else {
      this.title = 'Error'
    }
    this.displayNeeds = true;
  }


}
