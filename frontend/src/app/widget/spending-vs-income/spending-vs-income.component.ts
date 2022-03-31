import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { IncomeHistoryService } from 'src/app/services/income-history.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-spending-vs-income',
  templateUrl: './spending-vs-income.component.html',
  styleUrls: ['./spending-vs-income.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SpendingVsIncomeComponent implements OnInit {
  chartData: any;
  dataExists: boolean = false;
  chartOptions: any;
  values: number[] = []
  values2: number[] = []
  monthValues: string[] = []
  yearSel: number = this.ts.year //default to current year
  monthLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, 
    private incServ: IncomeHistoryService,
    private trigServ: TriggerService, public ts: TimeService) { 
      Chart.register(ChartDataLabels)
      this.trigServ.incomReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.expenReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })
  }

  setupValues()
  {
    this.values = []
    this.values2 = []
    this.monthValues = []
    let data = this.spenServ.spendByMonth.filter((value) => value.year == this.yearSel)
    let data2 = this.incServ.incomeByMonth.filter((value) => value.year == this.yearSel)

    for (let i in this.monthLabels)
    {
      let val1 = data.find((value) => value.month == parseInt(i) + 1)
      let val2 = data2.find((value) => value.month == parseInt(i) + 1)
      if (val1 != null || val2 != null)
      {
        this.monthValues.push(this.monthLabels[i])
        this.values.push(val1 ? val1.totalSpent : 0)
        this.values2.push(val2 ? val2.totalIncomeReceived : 0)
      }  
    }

    if (data.length == 0 && data2.length == 0)
    {
      this.dataExists = false;
    }
    else
    {
      this.dataExists = true;
    }
  }

  ngOnInit(): void {

    this.setupValues()

    //TODO: Implement http request
    this.chartData = {
      labels: this.monthValues,
      datasets: [
          {
              label: 'Spending',
              data: this.values,
              fill: true,
              borderColor: 'rgba(0, 0, 255, 0.5)',
              barPercentage: 0.9,
              backgroundColor: (context) => {   
                  let sum = this.values[context.dataIndex]
                  let value = this.values2[context.dataIndex]
                  let percentage = (sum*100 / value);
                  return this.getColorLight(percentage)
              },
              tension: 0,
              
          },
          {
            label: 'Income',
            data: this.values2,
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
            datalabels: {
              align: 'center',
              anchor: 'center',
              backgroundColor: (context) => {
                
                  let sum = this.values[context.dataIndex]
                  let value = this.values2[context.dataIndex]
                  let percentage = (sum*100 / value);
                  if (value == 0 || value == undefined)
                  {
                    return "rgba(0, 0, 0, 0.72)"
                  }
                  return this.getColor(percentage)
               
            },
              borderRadius: 4,
              font: {
                weight: 'bold'
              },
              display: (context) => {
               // console.log(context)
               if (context.dataset.label == 'Income' && this.values2[context.dataIndex] > this.values[context.dataIndex])
               {
                 return true;
               }
               else if (context.dataset.label == 'Spending' && this.values[context.dataIndex] > this.values2[context.dataIndex])
               {
                 return true;
               }
               return false;
              },
              formatter: (value, context) => {
                  
                   // console.log(value)
                    let sum = this.values[context.dataIndex]
                    let val = this.values2[context.dataIndex]
                    if (val == 0 || val == undefined)
                    {
                      return "No Income Data"
                    } 
                    else
                    {
                      let percentage = (sum*100 / val).toFixed(2)+"%";
                      return percentage;
                    }
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
                text: 'Months',
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
        this.chartData.labels = this.monthValues
        this.chartData.datasets[0].data = this.values;
        this.chartData.datasets[1].data = this.values2;
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
