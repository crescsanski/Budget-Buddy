import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { Category } from 'src/app/models/category';

import { BudgetCategory } from 'src/app/models/formModels/budgetCategory';
import { BudgetService } from 'src/app/services/budget.service';
import { CategoryService } from 'src/app/services/category.service';
import { IncomeHistoryService } from 'src/app/services/income-history.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-budget-vs-spending',
  templateUrl: './budget-vs-spending.component.html',
  styleUrls: ['./budget-vs-spending.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class BudgetVsSpendingComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  categories: string[] = []
  catOptions: Category[] = []
  selectedCats: Category[] = []
  budgetValues: number[];
  spendingValues: number[] = []
  selDate: Date = new Date();

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, private budServ: BudgetService,
    private incServ: IncomeHistoryService,
    private catServ: CategoryService,
    private trigServ: TriggerService, private ts: TimeService) { 

      this.catOptions = this.catServ.expenseCats
      this.selectedCats = this.catServ.expenseCats

      this.trigServ.expenReceiptAnnounced$.subscribe(() =>
      {
          this.getNewData();
      })
  }

  setupValues()
  {

    this.spendingValues = []
    this.budgetValues = []
    this.categories = []

    let budgetData = this.budServ.exBudByCat

    let spendData = this.spenServ.catSpenByMonth.filter(value => value.year == this.selDate.getFullYear() && value.month == this.selDate.getMonth() + 1)
    for (let i of this.selectedCats)
    {
      let spenValue = spendData.find(value => value.category_id == i.category_id)
      let budgetValue = budgetData.find(value => value.categoryTitle == i.category_name)

      if (spenValue || budgetValue)
      {
        this.categories.push(i.category_name)
        spenValue ? this.spendingValues.push(spenValue.totalSpent) : this.spendingValues.push(0)
        budgetValue ? this.budgetValues.push(budgetValue.amount) : this.budgetValues.push(0)
      }
      
    }
  }


  ngOnInit(): void {

  
    this.setupValues();

    //TODO: Implement http request
    this.chartData = {
      labels: this.categories,
      datasets: [
          {
              label: 'Spending',
              data: this.spendingValues,
              fill: true,
              borderColor: '#4ec5ca80',
              backgroundColor: '#4ec5ca50',
              tension: 0,
              
          },
          {
            label: 'Budget',
            data: this.budgetValues,
            fill: true,
            borderColor: '#64e3dd',
            backgroundColor: '#64e3dd',
            tension: 0,
            
        },
      ]
  };

  this.chartOptions = {
    plugins: {
        legend: {
            display: true,
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            title: {
                display: true,
                text: 'Categories',
                font: {
                    size: 20
                }
            },
            grid: { display: false }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            title: {
                display: true,
                text: 'Amount (in $)',
                font: {
                    size: 20
                }
            },
            grid: { display: false }
        }
    }
  }

}

    async getNewData()
    {
        this.setupValues()
        this.chartData.labels = this.categories
        this.chartData.datasets[0].data = this.spendingValues
        this.chartData.datasets[1].data = this.budgetValues
        this.chart.reinit();
    }

}
