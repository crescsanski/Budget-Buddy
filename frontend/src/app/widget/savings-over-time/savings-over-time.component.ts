import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { SavingsOverTime } from 'src/app/models/savingsOverTime';
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
  allTime: boolean = true;
  rangeDates: Date[] = [this.ts.minDate, this.ts.maxDate]
  types: any[] = 
  [
     { name: "Yearly", value: "yearly"},
     { name: "Monthly", value: "monthly"},
     { name: "Weekly", value: "weekly"}
  ]
  selectedType: string = "monthly"
  chartOptions: any;
  yearSel: number = this.ts.year //default to current year
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  @ViewChild('chart') chart: UIChart;

  constructor(private dp: DatePipe, private savServ: SavingsHistoryService, private trigServ: TriggerService, public ts: TimeService) { 
      this.trigServ.incomReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })

      this.trigServ.expenReceiptChanged$.subscribe(() =>
      {
          this.getNewData();
      })
  }

  syncData()
  {
    let newData = this.savServ.cumSavings.filter((value) => {
        let date = this.ts.getDate(value.week, value.year)
        return date >= this.rangeDates[0] && date <= this.rangeDates[1]
       })



    var result: SavingsOverTime[] = [];
    var labels = []
    var groups = []
    var xTitle: string;
    var grouped = {};
    if (this.selectedType == "yearly")
    {
        result = this.groupByAndSum(newData, "yearly")

        labels = result.map(val => val.year)

        xTitle = "Years"
    }
    else if (this.selectedType == "monthly")
    {

        result = this.groupByAndSum(newData, "monthly")
        xTitle = "Months"

        labels = result.map(val => `${this.monthNames[val.month - 1]} ${val.year}`)
    }
    else
    {
        result = this.groupByAndSum(newData, "weekly")
        xTitle = "Weeks"
        labels = result.map(val => this.ts.getDate(val.week, val.year).toISOString().substring(0, 10))
    }

    if (result.length > 1)
    {
        this.dataExists = true;
    }
    else
    {
        this.dataExists = false;
    }


    let values = result.map((value) => value.totalSavings)

    return {labels: labels, values: values, xTitle: xTitle}
  }

  groupByAndSum(data: SavingsOverTime[], type: string): SavingsOverTime[]
  {
    const result: SavingsOverTime[] = [...data.reduce((r, o) => {
        var key: string;
        switch (type)
        {
            case "yearly":
                key = `${o.year}`; 
                break;
            case "monthly":
                key = o.year + "-" + o.month;
                break;
            case "weekly":
                key = o.year + "-" + o.month + "-" + o.week;
        }
         
        const item = r.get(key) || Object.assign({}, o, {
          totalSavings: 0,
        });
        
        if (o.totalSavings > item.totalSavings)
        {
            item.totalSavings = o.totalSavings;
        }
        
        return r.set(key, item);
      }, new Map).values()];

      return result
  }

  ngOnInit(): void {

    let data = this.syncData();


    //TODO: Implement http request
    this.chartData = {
      labels: data.labels,
      datasets: [
          {
              label: 'Savings',
              data: data.values,
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
                text: data.xTitle,
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

    getNewData()
    {
        let data = this.syncData();

        this.chartData.labels = data.labels;
        this.chartData.datasets[0].data = data.values;
        this.chartOptions.scales.x.title.text = data.xTitle;
        this.chart.refresh();

    }

}
