import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { IncomeHistoryService } from 'src/app/services/income-history.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-spending-vs-income',
  templateUrl: './spending-vs-income.component.html',
  styleUrls: ['./spending-vs-income.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SpendingVsIncomeComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  values: number[] = []
  values2: number[] = []
  monthValues: string[] = []
  yearSel: number = this.ts.year //default to current year
  monthLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, 
    private incServ: IncomeHistoryService,
    private trigServ: TriggerService, private ts: TimeService) { 
      this.trigServ.incomReceiptAnnounced$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.expenReceiptAnnounced$.subscribe(() =>
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
              borderColor: '#4ec5ca80',
              backgroundColor: '#4ec5ca50',
              tension: 0,
              
          },
          {
            label: 'Income',
            data: this.values2,
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
                text: 'Months',
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
        this.chartData.labels = this.monthValues
        this.chartData.datasets[0].data = this.values;
        this.chartData.datasets[1].data = this.values2;
        this.chart.reinit();
    }

}
