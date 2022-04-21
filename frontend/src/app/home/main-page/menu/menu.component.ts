
import { MainPageComponent } from '../main-page.component';
import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChallengesService } from 'src/app/services/challenges.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  name: string = 'John Doe';
  level: number;
  selected: string = '';
  main: MainPageComponent | undefined;
  
  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private trigServ: TriggerService, private challServ: ChallengesService, authServ: AuthService) {

    this.trigServ.levelGained$.subscribe(() =>
    {
      this.level = this.challServ.levProgress.level
    })

    if (authServ.currentUserValue)
    {
      this.name = authServ.currentUserValue.user_first_name + " " + authServ.currentUserValue.user_last_name;
      this.level = authServ.currentUserValue.user_level;
    }      
   }

  ngOnInit(): void {
    this.selected = 'Dashboard';
    
  }

  onClick(item: string){
    this.selected = item;
    this.notify.emit(this.selected);
  }

}
