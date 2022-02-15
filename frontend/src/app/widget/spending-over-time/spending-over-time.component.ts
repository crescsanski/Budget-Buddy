import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-spending-over-time',
  templateUrl: './spending-over-time.component.html',
  styleUrls: ['./spending-over-time.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SpendingOverTimeComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  yearSel: number = this.ts.year //default to current year
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, private trigServ: TriggerService, private ts: TimeService) { 
      this.trigServ.incomReceiptAnnounced$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.expenReceiptAnnounced$.subscribe(() =>
      {
          this.getNewData();
      })
  }

  ngOnInit(): void {

    let data = this.spenServ.spendByMonth.filter((value) => value.year == this.yearSel)
    let monthLabels = data.map((value) => this.monthNames[value.month - 1])
    let values = data.map((value) => value.totalSpent)

    //TODO: Implement http request
    this.chartData = {
      labels: monthLabels,
      datasets: [
          {
              label: 'Spending',
              data: values,
              fill: true,
              borderColor: '#4ec5ca80',
              backgroundColor: '#4ec5ca50',
              tension: 0,
              
          },
      ]
  };

  this.chartOptions = {
    plugins: {
        legend: {
            display: false,
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
        let newData = this.spenServ.spendByMonth.filter((value) => value.year == this.yearSel)
        let monthLabels = newData.map((value) => this.monthNames[value.month - 1])
        let values = newData.map((value) => value.totalSpent)

        this.chartData.labels = monthLabels;
        this.chartData.datasets[0].data = values;
        this.chart.reinit();

    }

}
