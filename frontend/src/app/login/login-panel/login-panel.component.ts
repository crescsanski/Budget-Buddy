import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buttonClick(){
    console.log('to main page');
    this.router.navigateByUrl('/main-page');
  }


}
