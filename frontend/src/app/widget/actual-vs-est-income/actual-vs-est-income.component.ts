import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { Category } from 'src/app/models/category';
import { BudgetService } from 'src/app/services/budget.service';

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

    let estIncData = this.budServ.inBudByCat

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
              backgroundColor: '#4ec5ca50',
              tension: 0,
              
          },
          {
            label: 'Estimated Income',
            data: this.estIncValues,
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
                text: 'Categories',
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
        this.chartData.labels = this.categories
        this.chartData.datasets[0].data = this.actIncValues
        this.chartData.datasets[1].data = this.estIncValues
        this.chart.reinit();
    }

}
