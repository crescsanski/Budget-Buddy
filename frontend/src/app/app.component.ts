import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
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
