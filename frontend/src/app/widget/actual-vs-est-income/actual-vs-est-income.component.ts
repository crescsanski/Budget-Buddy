import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import {Chart} from 'chart.js';
import { Category } from 'src/app/models/category';
import { BudgetService } from 'src/app/services/budget.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CategoryService } from 'src/app/services/category.service';
import { IncomeHistoryService } from 'src/app/services/income-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';
import { BudgetCategory } from 'src/app/models/formModels/budgetCategory';
import { Budget } from 'src/app/models/budget';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-actual-vs-est-income',
  templateUrl: './actual-vs-est-income.component.html',
  styleUrls: ['./actual-vs-est-income.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ActualVsEstIncomeComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  selection: boolean = true;
  dataExists: boolean = false;
  categories: string[] = []
  catOptions: Budget[] = []
  selectedCats: Budget[] = []
  estIncValues: number[];
  actIncValues: number[] = []
  selDate: Date = new Date();
  today: Date = new Date();
  regDate: Date;
  yearRange: string;

  @ViewChild('chart3') chart: UIChart;

  constructor(private budServ: BudgetService,
    private incServ: IncomeHistoryService,
    private athServ: AuthService,
    private catServ: CategoryService,
    private trigServ: TriggerService, public ts: TimeService) { 
      this.regDate = new Date(this.athServ.currentUserValue.user_registration_date)
      this.yearRange = this.regDate.getFullYear() + ":" + this.today.getFullYear()
      Chart.register(ChartDataLabels)
      this.catOptions = this.budServ.inBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month)

      this.refreshFavorites();

      this.trigServ.incomReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.budgetUpdatedAnnounced$.subscribe(() =>
      {
        this.catOptions = this.budServ.inBudByCat.filter(val => val.year == this.ts.year && val.month == this.ts.month)

        this.refreshFavorites();

        this.getNewData();
      })
  }

  refreshFavorites()
  {
    this.selectedCats = this.catOptions.filter(val => val.is_favorite);

    if (this.budServ.noIncFavorites)
    {
      this.selection = false;
      this.selectedCats = this.catOptions
    }
  }

  setupValues()
  {

    this.actIncValues = []
    this.estIncValues = []
    this.categories = []

    let estIncData = this.budServ.inBudByCat.filter(value => value.year == this.selDate.getFullYear() && value.month == this.selDate.getMonth() + 1)

    let acIncdData = this.incServ.catIncomeByMonth.filter(value => value.year == this.selDate.getFullYear() && value.month == this.selDate.getMonth() + 1)
    for (let i of this.selectedCats)
    {
      let acIncValue = acIncdData.find(value => value.category_id == i.category_id)
      let estIncValue = estIncData.find(value => value.categoryTitle == i.categoryTitle)

      if (acIncValue || estIncValue)
      {
        this.categories.push(i.categoryTitle)
        acIncValue ? this.actIncValues.push(acIncValue.totalIncomeReceived) : this.actIncValues.push(0)
        estIncValue ? this.estIncValues.push(estIncValue.altered_amount) : this.estIncValues.push(0)
      }
      
    }

    if (estIncData.length == 0 && acIncdData.length == 0)
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
      labels: this.categories,
      datasets: [
          {
              label: 'Actual Income',
              data: this.actIncValues,
              fill: true,
              barPercentage: 0.9,
              backgroundColor: (context) => {   
                  let sum = this.actIncValues[context.dataIndex]
                  let value = this.estIncValues[context.dataIndex]
                  let percentage = (sum*100 / value);
                  return this.getColorLight(percentage)
              },
              tension: 0,
              
          },
          {
            label: 'Estimated Income',
            data: this.estIncValues,
            fill: true,
            backgroundColor: 'rgba(78, 197, 202, 0.35)',
            barPercentage: 1,
            tension: 0,
            
        },
      ]
  };

  this.chartOptions = {
    plugins: {
        datalabels: {
          align: 'center',
          anchor: 'center',
          backgroundColor: (context) => {
           
              let sum = this.actIncValues[context.dataIndex]
              let value = this.estIncValues[context.dataIndex]
              let percentage = (sum*100 / value);
              return this.getColor(percentage)
            
        },
          borderRadius: 4,
          font: {
            weight: 'bold'
          },
          display: (context) => {
           // console.log(context)
              if (context.dataset.label == 'Estimated Income' && this.estIncValues[context.dataIndex] > this.actIncValues[context.dataIndex])
              {
                return true;
              }
              else if (context.dataset.label == 'Actual Income' && this.actIncValues[context.dataIndex] > this.estIncValues[context.dataIndex])
              {
                return true;
              }
              return false;
              
          },
          formatter: (value, context) => {
             
               // console.log(value)
                let sum = this.actIncValues[context.dataIndex]
                let val = this.estIncValues[context.dataIndex]
                let percentage = (sum*100 / val).toFixed(2)+"%";
                return percentage;
          },
          color: 'white',
      },
        legend: {
            display: true,
        }
    },
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
        this.chartData.datasets[0].data = this.actIncValues
        this.chartData.datasets[1].data = this.estIncValues
        this.chart.refresh();
    }

    getColor(num: number)
    {
      if (num <= 100)
      {
        return 'rgba(44, 28, 150, 1)'

      }
      else
      {
        return 'rgba(76, 192, 94, 1)'
      }
    }

    getColorLight(num: number)
    {
      if (num <= 100)
      {
        return 'rgba(44, 28, 150, 0.35)'

      }
      else
      {
        return 'rgba(76, 192, 94, 0.35)'
      }
    }

}
