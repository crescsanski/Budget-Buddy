
import { MainPageComponent } from './../main-page.component';
import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  name: string = 'John Doe';
  level: string = '';
  selected: string = '';
  main: MainPageComponent | undefined;
  
  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(authServ: AuthService) {

    if (authServ.currentUserValue)
    {
      this.name = authServ.currentUserValue.first_name + " " + authServ.currentUserValue.last_name;
    }      
   }

  ngOnInit(): void {
    this.level = 'Level 1';
    this.selected = 'Dashboard';
    
  }

  onClick(item: string){
    this.selected = item;
    this.notify.emit(this.selected);
  }

}
