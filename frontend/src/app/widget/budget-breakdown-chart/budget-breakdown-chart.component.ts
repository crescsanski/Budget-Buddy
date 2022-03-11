import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import {Chart, ChartItem} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-budget-breakdown-chart',
  templateUrl: './budget-breakdown-chart.component.html',
  styleUrls: ['./budget-breakdown-chart.component.scss']
})
export class BudgetBreakdownChartComponent implements OnInit {
  stackedData: any;
  stackedOptions: any;

  categories = ['want', 'need', 'saving']

  selectedCategory = "";

  @Input() availableBudget: number;
  @Input() breakdown: {want: number, need: number, debt: number}
  myChart: Chart 

  constructor() { 
    Chart.register(ChartDataLabels)
  }

  refresh()
  {
    this.myChart.data.datasets[0].data = [this.breakdown.want, this.breakdown.need, this.breakdown.debt]
    this.myChart.update()
  }
    
    

  ngOnInit(): void {
    const ctx = document.getElementById('chart') as ChartItem;
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: { 
        labels: ['Wants', 'Needs', 'Savings'], 
      datasets: [
          {
              label: 'Spending',
              data: [this.breakdown.want, this.breakdown.need, this.breakdown.debt],
              backgroundColor: [
                "#003486 ",
                "#4ec5ca",
                "#4eca9f",
                "#03fca9",
                "#93d9f5",
                "#008048"
            ],
            
            datalabels: {
              labels: {
                name: {
                  align: 'top',
                  color: 'black',
                  backgroundColor: 'white'
                  ,
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  font: {size: 20},
                  formatter: function(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex];
                  }
                },
                value: {
                  align: 'bottom',
                  backgroundColor: 'white',
                  font: {size: 20},
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  color: 'black',
                  formatter: function(value, ctx) {
                    let dataset = ctx.dataset.data as number[]
                    let sum = dataset.reduce((a, b) => a + b, 0)
                    let percen = Math.round(value*100 / sum)+"%";
                    return percen;
                  },
                  padding: 4,
                  offset: 2
                }
              }
            }
          }]

      },
      options: {
        plugins: {
          legend: {
            display: false,
        },
          datalabels: {
            color: 'white',
            display: true,
            font: {
              weight: 'bold',
            },
            offset: 0,
            padding: 0
          }
        }
      }
    })
  }

}


