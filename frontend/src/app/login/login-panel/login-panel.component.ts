import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent implements OnInit {

  loginAttempt: boolean = false;
  loading: boolean = false;
  form: FormGroup = <FormGroup>{};

  constructor(private router: Router, 
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  login(){
  
    this.loginAttempt = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        this.messageService.addInfo(`Invalid Entry`, `Please fill out both the username and password fields.`);
        return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe({
            next: (user) => {
                // redirect to main page of app if login was successful
                if (user)
                {
                    console.log('to main page');
                    this.router.navigateByUrl('/main-page');
                }
            },
            error: error => {
              for (const key in error)
              {
                this.messageService.addError(`Login Error: ${key}`, error[key]);
              }
                this.loading = false;
            }
        });
  }

  register() {
    this.router.navigateByUrl('/register-page');
    }


}
