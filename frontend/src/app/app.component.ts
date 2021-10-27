import { Component, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/*
export class AppComponent implements OnInit{
  loginPage: boolean = true;

  constructor() { 
    this.loginPage = true;
  }

  toggleLogin(){
    this.loginPage = !this.loginPage;
  }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  title = 'budgetBuddy';
  */
export class AppComponent {
  user: User = <User>{};

  constructor(private authServ: AuthService)
  {
    this.authServ.currentUser.subscribe(x => this.user = <User>x);
  }

  logout() {
    this.authServ.logout();
  }
}


