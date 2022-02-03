import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-register-panel',
  templateUrl: './register-panel.component.html',
  styleUrls: ['./register-panel.component.scss']
})
export class RegisterPanelComponent implements OnInit {

  registerAttempt: boolean = false;
  loading: boolean = false;
  form: FormGroup = <FormGroup>{};

  constructor(private router: Router, 
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      user_user_name: ['', Validators.required],
      password: ['', Validators.required],
      user_email: ['', Validators.compose([Validators.required, Validators.email])],
      user_first_name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      user_last_name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      user_phone_number: ['', Validators.required],
      user_birth_date: ['', Validators.required],
      user_has_notifications: [false, Validators.required],
  });

  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  register() {
    this.registerAttempt = true;
 
    // stop here if form is invalid
    if (this.form.invalid) {
        this.messageService.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
        return;
    }

    this.loading = true;
    this.authService.register(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.messageService.addSuccess('Registration successful', "");
                //let's auto-log in the user with the inputted data
                this.authService.login(this.form.get('user_user_name').value, this.form.get('password').value)
                .pipe(first())
                .subscribe({
                    next: (user) => {
                        // redirect to budget creation page if login was successful
                        if (user)
                        {
                          this.router.navigateByUrl('/new-budget');
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
            },
            error: error => {
                for (const key in error)
                {
                  this.messageService.addError(`Registration Error: ${key}`, error[key]);
                }
   
                this.loading = false;
            }
        });
    }
}
