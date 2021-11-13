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

  //Force a logout on close for security
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any) {
    let user = this.authServ.currentUserValue;
    if (user && user.token)
    {
      this.logout();
    }
  }

  logout() {
    this.authServ.logout().subscribe();
  }
}


