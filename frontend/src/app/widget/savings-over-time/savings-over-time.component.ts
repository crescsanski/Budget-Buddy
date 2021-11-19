import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-savings-over-time',
  templateUrl: './savings-over-time.component.html',
  styleUrls: ['./savings-over-time.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class SavingsOverTimeComponent implements OnInit {
  chartData: any;
  chartOptions: any;


  constructor() { }

  ngOnInit(): void {

    //TODO: Implement http request
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [10, 29, 32, 50, 56, 40, 50],
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
            grid: { display: false }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: { display: false }
        }
    }
  }

}
}
