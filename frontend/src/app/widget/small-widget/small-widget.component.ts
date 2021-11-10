import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-widget',
  templateUrl: './small-widget.component.html',
  styleUrls: ['./small-widget.component.scss']
})
export class SmallWidgetComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() smallSize: boolean = false;
  @Input() button: string | undefined;


  
  imageUrl: string ='';
  
  constructor() { }

  ngOnInit(): void {
  }

  overlay(){
    console.log('overlay');
  }

}