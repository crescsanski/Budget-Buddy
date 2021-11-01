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
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      birth_date: ['', Validators.required],
      notifications: ['', Validators.required],
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  register() {

    this.registerAttempt = true;


    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.authService.register(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.messageService.addSuccess('Registration successful', "");
                this.router.navigateByUrl('/login-page');
            },
            error: error => {
                this.messageService.addError('Registration Error', error);
                this.loading = false;
            }
        });
    }


}
