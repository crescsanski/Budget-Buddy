import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.scss']
})
export class LoginNavComponent implements OnInit {
  aboutVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  viewAbout(){
    this.aboutVisible = true;
  }

}
