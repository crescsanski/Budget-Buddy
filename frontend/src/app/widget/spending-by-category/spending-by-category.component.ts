import { Component, OnInit } from '@angular/core';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'app-spending-by-category',
  templateUrl: './spending-by-category.component.html',
  styleUrls: ['./spending-by-category.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SpendingByCategoryComponent implements OnInit {


  data: any;

  constructor() { 

    this.data = {
      labels: ['Housing', 'Transportation', 'Essential Groceries', 'Non-Essential Groceries', "Utilities", "Insurance", "Medical", "Entertainment", "Lifestyle Essentials", "Lifestyle Non-Essentials"], //Needs to be changed to new categories
      datasets: [
          {
              label: 'Spending',
              data: [65, 59, 80, 81, 20, 50, 40, 39],
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

  }

  ngOnInit(): void {
  }

}