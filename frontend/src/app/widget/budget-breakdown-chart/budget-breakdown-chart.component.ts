import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-budget-breakdown-chart',
  templateUrl: './budget-breakdown-chart.component.html',
  styleUrls: ['./budget-breakdown-chart.component.scss']
})
export class BudgetBreakdownChartComponent implements OnInit, OnChanges {
  stackedData: any;
  stackedOptions: any;

  categories = ['want', 'need', 'saving']

  selectedCategory = "";

  @Input() availableBudget: number;
  @Input() breakdown: {want: number, need: number, debt: number}
  @ViewChild('chart') chart: UIChart; 

  constructor() { 
    Chart.register(ChartDataLabels)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.stackedData)
    {
      var update = false;
      
      
      if ('availableBudget' in changes && changes['availableBudget'].previousValue != this.availableBudget)
      {
        //console.log(changes['availableBudget'].previousValue)
        //console.log(this.availableBudget)
        update = true;
      }  
      if ('breakdown' in changes)
      {
        if (changes['breakdown'].previousValue.need != this.breakdown.need)
        {
          update = true;
        }
        if (changes['breakdown'].previousValue.debt != this.breakdown.debt)
        {
          update = true;
        }
        if (changes['breakdown'].previousValue.want != this.breakdown.want)
        {
          update = true;
        }
      }
      
      if (update)
      {
        this.ngOnInit();
      }
    }
   
  }
    
    

  ngOnInit(): void {

    this.stackedData = {
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
                  font: {size: '20em'},
                  formatter: function(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex];
                  }
                },
                value: {
                  align: 'bottom',
                  backgroundColor: 'white',
                  font: {size: '20em'},
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  color: 'black',
                  formatter: function(value, ctx) {
                    let sum = ctx.dataset.data.reduce((a, b) => a + b, 0)
                    let percen = Math.round(value*100 / sum)+"%";
                    return percen;
                  },
                  padding: 4,
                  offset: 2
                }
              }
            }
          }]
    }

  


 this.stackedOptions = {
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
        };
    }

  }


