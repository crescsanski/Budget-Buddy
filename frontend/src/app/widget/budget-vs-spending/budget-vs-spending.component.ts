import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { Category } from 'src/app/models/category';
import {Chart} from 'chart.js';

import { BudgetCategory } from 'src/app/models/formModels/budgetCategory';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BudgetService } from 'src/app/services/budget.service';
import { CategoryService } from 'src/app/services/category.service';
import { IncomeHistoryService } from 'src/app/services/income-history.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';
import { getLocaleDateFormat } from '@angular/common';
import { Budget } from 'src/app/models/budget';

@Component({
  selector: 'app-budget-vs-spending',
  templateUrl: './budget-vs-spending.component.html',
  styleUrls: ['./budget-vs-spending.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class BudgetVsSpendingComponent implements OnInit {
  dataExists: boolean = false;
  chartData: any;
  chartOptions: any;
  selection: boolean = true;
  categories: string[] = []
  catOptions: Budget[] = []
  typeOptions: SelectItem[] = []
  selectedCats: Budget[] = []
  selectedTypes: string[] = ['want', 'need', 'saving']
  budgetValues: number[];
  spendingValues: number[] = []
  selDate: Date = new Date();

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, private budServ: BudgetService,
    private incServ: IncomeHistoryService,
    private catServ: CategoryService,
    private trigServ: TriggerService, public ts: TimeService) { 
      Chart.register(ChartDataLabels)
    

      
      this.typeOptions = this.budServ.types;

      this.catOptions = this.budServ.exBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month)

      this.refreshFavorites();

      this.trigServ.expenReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })


      this.trigServ.budgetUpdatedAnnounced$.subscribe(() =>
      {
        this.catOptions = this.budServ.exBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month)

        this.refreshFavorites();

        this.getNewData();
      })
  }

  refreshFavorites()
  {
    this.selectedCats = this.catOptions.filter(val => val.is_favorite);

    if (this.budServ.noExpFavorites)
    {
      this.selection = false;
      this.selectedCats = this.catOptions;
    }

  }

  setupValues()
  {

    this.spendingValues = []
    this.budgetValues = []
    this.categories = []

    let budgetData = this.budServ.exBudByCat.filter(value => value.year == this.selDate.getFullYear() && value.month == this.selDate.getMonth() + 1
        && this.selectedTypes.includes(value.category_type))

    let spendData = this.spenServ.catSpenByMonth.filter(value => value.year == this.selDate.getFullYear() && value.month == this.selDate.getMonth() + 1
      && this.selectedTypes.includes(value.category__category_type))
    for (let i of this.selectedCats)
    {
      let spenValue = spendData.find(value => value.category_id == i.category_id)
      let budgetValue = budgetData.find(value => value.categoryTitle == i.categoryTitle)
      var spend;
      if (spenValue == null)
      {
        spend = 0
      }
      else
      {
        spend = spenValue.totalSpent;
      }
      if (budgetValue)
      {
        this.categories.push(i.categoryTitle)
        this.spendingValues.push(spend)
        this.budgetValues.push(budgetValue.altered_amount)
      }
      
    }

    if (spendData.length == 0 && budgetData.length == 0)
    {
      this.dataExists = false;
    }
    else
    {
      this.dataExists = true;
    }
  }


  ngOnInit(): void {

  
    this.setupValues();

    //TODO: Implement http request
    this.chartData = {
      indexAxis: 'y',
      labels: this.categories,
      datasets: [
          {
              label: 'Actual Expenses',
              data: this.spendingValues,
              fill: true,
              borderColor: 'rgba(0, 0, 255, 0.5)',
              barPercentage: 0.9,
              backgroundColor: (context) => {   
                  let sum = this.spendingValues[context.dataIndex]
                  let value = this.budgetValues[context.dataIndex]
                  let percentage = (sum*100 / value);
                  return this.getColorLight(percentage)
              },
              tension: 0,
              
          },
          {
            label: 'Estimated Expenses',
            data: this.budgetValues,
            fill: true,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            barPercentage: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            tension: 0,
            
        },
      ]
  };

  this.chartOptions = {
    plugins: {
        legend: {
            display: true,
           
        },
        datalabels: {
          align: 'center',
          anchor: 'center',
          backgroundColor: (context) => {
       
              let sum = this.spendingValues[context.dataIndex]
              let value = this.budgetValues[context.dataIndex]
              let percentage = (sum*100 / value);
              return this.getColor(percentage)
  
        },
          borderRadius: 4,
          font: {
            weight: 'bold'
          },
          display: (context) => {
           // console.log(context)
           if (context.dataset.label == 'Estimated Expenses' && this.budgetValues[context.dataIndex] > this.spendingValues[context.dataIndex])
           {
             return true;
           }
           else if (context.dataset.label == 'Actual Expenses' && this.spendingValues[context.dataIndex] > this.budgetValues[context.dataIndex])
           {
             return true;
           }
           return false;
          },
          formatter: (value, context) => {
   
                let sum = this.spendingValues[context.dataIndex]
                let val = this.budgetValues[context.dataIndex]
                let percentage = (sum*100 / val).toFixed(2)+"%";
                return percentage;
          },
          color: 'white',
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
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
        stacked: false,
        ticks: {
          color: '#495057',
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
        this.chart.refresh();
    }

    getColor(num: number)
    {
      if (num <= 100)
      {
        return 'rgba(76, 192, 94, 1)'

      }
      else
      {
        return 'rgba(255, 0, 0, 1)'
      }
    }

    getColorLight(num: number)
    {
      if (num <= 100)
      {
        return 'rgba(76, 192, 94, 0.35)'

      }
      else
      {
        return 'rgba(255, 0, 0, 0.35)'
      }
    }

}
