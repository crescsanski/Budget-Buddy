import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss', './../small-widget/small-widget.component.scss']
})
export class TrackingComponent implements OnInit {
  name: string | undefined;
  date: Date | undefined;


  constructor() { 
    
  }

  ngOnInit(): void {
    let date = new Date();
  
   

  }

  track(name: string) {
    this.name = name;
  }

}
