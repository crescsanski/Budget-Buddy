import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { SavingsHistoryService } from 'src/app/services/savings-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-savings-over-time',
  templateUrl: './savings-over-time.component.html',
  styleUrls: ['./savings-over-time.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SavingsOverTimeComponent implements OnInit {
  chartData: any;
  dataExists: boolean = false;
  chartOptions: any;
  yearSel: number = this.ts.year //default to current year
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  @ViewChild('chart') chart: UIChart;

  constructor(private savServ: SavingsHistoryService, private trigServ: TriggerService, public ts: TimeService) { 
      this.trigServ.incomReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.expenReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })
  }

  ngOnInit(): void {

    let data = this.savServ.cumSavingsByMonth.filter((value) => value.year == this.yearSel)
    let monthLabels = data.map((value) => this.monthNames[value.month - 1])
    let values = data.map((value) => value.totalSavings)

    //TODO: Implement http request
    this.chartData = {
      labels: monthLabels,
      datasets: [
          {
              label: 'Savings',
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
        datalabels: { display: false },
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
        let newData = this.savServ.cumSavingsByMonth.filter((value) => value.year == this.yearSel)
        if (newData.length > 0)
        {
            this.dataExists = true;
        }
        else
        {
            this.dataExists = false;
        }
        let monthLabels = newData.map((value) => this.monthNames[value.month - 1])
        let values = newData.map((value) => value.totalSavings)

        this.chartData.labels = monthLabels;
        this.chartData.datasets[0].data = values;
        this.chart.refresh();

    }

}
