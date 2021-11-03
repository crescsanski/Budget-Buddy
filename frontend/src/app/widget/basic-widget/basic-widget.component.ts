import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-widget',
  templateUrl: './basic-widget.component.html',
  styleUrls: ['./basic-widget.component.scss']
})
export class BasicWidgetComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() smallSize: boolean = false;

  
  imageUrl: string ='';
  
  constructor() { }

  ngOnInit(): void {
  }

}
