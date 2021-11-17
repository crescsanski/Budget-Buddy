import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-widget',
  templateUrl: './spending-tracking.component.html',
  styleUrls: ['./spending-tracking.component.scss']
})
export class SpendingTracking implements OnInit {
  @Input() image: string | undefined;
  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() smallSize: boolean = false;

  
  imageUrl: string ='';
  
  constructor() { }

  ngOnInit(): void {
  }

}
