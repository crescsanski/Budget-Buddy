import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  user: User | null = null;

  constructor(private authServ: AuthService)
  {
    this.authServ.currentUser.subscribe(x => this.user = <User>x);
  }

  cleanLogout() {
    this.authServ.cleanLogout().subscribe();
  }
}


