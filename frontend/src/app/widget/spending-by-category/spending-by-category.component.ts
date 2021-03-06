import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {ChartModule, UIChart} from 'primeng/chart';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { SpendingHistoryService } from 'src/app/services/spending-history.service';
import { TimeService } from 'src/app/services/time.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-spending-by-category',
  templateUrl: './spending-by-category.component.html',
  styleUrls: ['./spending-by-category.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SpendingByCategoryComponent implements OnInit {

  dataExists: boolean = false;
  data: any;
  chartOptions: any;
  catOptions: Category[] = [];
  categories: string[] = []
  curMonthSpendByCat: number[] = [];
  selDate: Date = new Date();

  @ViewChild('chart3') chart: UIChart;

  constructor(private spenServ: SpendingHistoryService, private catServ: CategoryService, public ts: TimeService, private trigServ: TriggerService) { 
    Chart.register(annotationPlugin)
    this.catOptions = this.catServ.expenseCats

    this.trigServ.expenReceiptChanged$.subscribe(() =>
    {
        this.getNewData();
    })

    


  }

  ngOnInit(): void {
    this.setupValues();

    this.data = {
      labels: this.categories, 
      datasets: [
          {
              label: 'Spending',
              data: this.curMonthSpendByCat,
              backgroundColor: [
                "#003486 ",
                "#4ec5ca",
                "#4eca9f",
                "#03fca9",
                "#93d9f5",
                "#008048"
            ],
          },
      ]
    }

    this.chartOptions = {
      plugins: {
          datalabels: { display: false },
          annotation: {
            annotations: {
              label1: {
                type: 'label',
                font: {
                  size: 18
                },
                textAlign: 'center',
                backgroundColor: 'rgba(245,245,245)',
                display: true,
                content: ['There is no data to display because there are no logged purchases for the selected month.']
              }
            }

          }
      }}
 }

  setupValues()
  {
    this.curMonthSpendByCat = []
    this.categories = []
    let spendData = this.spenServ.catSpenByMonth.filter(value => value.year == this.selDate.getFullYear() 
    && value.month == this.selDate.getMonth() + 1)
    for (let i of this.catOptions)
    {
      let spenValue = spendData.find(value => value.category_id == i.category_id)

      if (spenValue)
      {
        this.categories.push(i.category_name)
        spenValue ? this.curMonthSpendByCat.push(spenValue.totalSpent) : this.curMonthSpendByCat.push(0)
      }  
    }

    if (spendData.length > 0)
    {
      this.dataExists = true
    }
    else
    {
      this.dataExists = false;
    }
  }

  getNewData()
  {
    this.setupValues()
    this.data.labels = this.categories
    this.data.datasets[0].data = this.curMonthSpendByCat;
    this.chart.refresh()
  }

}