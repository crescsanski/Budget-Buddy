import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking-type',
  templateUrl: './tracking-type.component.html',
  styleUrls: ['./tracking-type.component.scss', './../small-widget/small-widget.component.scss']
})
export class TrackingTypeComponent implements OnInit {

  type: string = "spending"
  options: any[] = [{display: 'Spending', code: 'spending'}, {display: 'Income', code: 'income'}]

  constructor() { 
  }

  ngOnInit(): void {
  }

}
