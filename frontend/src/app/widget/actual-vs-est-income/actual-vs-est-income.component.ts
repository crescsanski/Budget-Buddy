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

@Component({
  selector: 'app-actual-vs-est-income',
  templateUrl: './actual-vs-est-income.component.html',
  styleUrls: ['./actual-vs-est-income.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ActualVsEstIncomeComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  categories: string[] = []
  catOptions: Category[] = []
  selectedCats: Category[] = []
  estIncValues: number[];
  actIncValues: number[] = []
  selDate: Date = new Date();

  @ViewChild('chart3') chart: UIChart;

  constructor(private budServ: BudgetService,
    private incServ: IncomeHistoryService,
    private catServ: CategoryService,
    private trigServ: TriggerService, private ts: TimeService) { 
      Chart.register(ChartDataLabels)
      this.catOptions = this.catServ.incomeCats
      this.selectedCats = this.catServ.incomeCats

      this.trigServ.incomReceiptAnnounced$.subscribe(() =>
      {
          this.getNewData();
      })
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
      let estIncValue = estIncData.find(value => value.categoryTitle == i.category_name)

      if (acIncValue || estIncValue)
      {
        this.categories.push(i.category_name)
        acIncValue ? this.actIncValues.push(acIncValue.totalIncomeReceived) : this.actIncValues.push(0)
        estIncValue ? this.estIncValues.push(estIncValue.amount) : this.estIncValues.push(0)
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
              label: 'Actual Income',
              data: this.actIncValues,
              fill: true,
              borderColor: '#4ec5ca80',
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
            borderColor: 'rgba(0, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            barPercentage: 1,
            tension: 0,
            
        },
      ]
  };

  this.chartOptions = {
    plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          backgroundColor: (context) => {
            if (context.dataset.label == 'Estimated Income')
            {
              let sum = this.actIncValues[context.dataIndex]
              let value = this.estIncValues[context.dataIndex]
              let percentage = (sum*100 / value);
              return this.getColor(percentage)
            }
          return ""
        },
          borderRadius: 4,
          font: {
            weight: 'bold'
          },
          display: (context) => {
           // console.log(context)
            return context.dataset.label == 'Estimated Income'
          },
          formatter: (value, context) => {
              if (context.dataset.label == 'Estimated Income')
              {
               // console.log(value)
                let sum = this.actIncValues[context.dataIndex]
                let percentage = (sum*100 / value).toFixed(2)+"%";
                return percentage;
              }
            return ""
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
        this.chart.reinit();
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
        return 'rgba(44, 28, 150, 0.5)'

      }
      else
      {
        return 'rgba(76, 192, 94, 0.5)'
      }
    }

}
