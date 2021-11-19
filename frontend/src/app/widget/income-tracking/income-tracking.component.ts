import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import { WidgetService } from '../widget.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-income-tracking',
  templateUrl: './income-tracking.component.html',
  styleUrls: ['./../tracking/tracking.component.scss', './../small-widget/small-widget.component.scss']
})
export class IncomeTrackingComponent implements OnInit {
form: FormGroup = <FormGroup>{};
  catOptions!: Category[];
  frequencyOptions!: String[];

  constructor(private ms: MessageService,
    private ws: WidgetService,
    private fb: FormBuilder,
    private cs: CategoryService) { 
      this.cs.getCategories().subscribe(
        (cats: Category[]) => 
        {
          this.catOptions = cats;
        }
      )
      
      //TODO: Implement w/ API
      this.frequencyOptions = [
        'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Annually'
      ]
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      income_name: ['', Validators.required],
      income_date: ['', Validators.required],
      income_amount: ['', Validators.required],
      category: ['', Validators.required]
});

  }

  track() {
    if (this.form.invalid) {
      this.ms.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
      console.log(this.form.controls)
      return;
    }

    /* this.ws.basicSpendingTransaction(this.form.value)
      .subscribe(()=> {this.form.reset()}
      ) */
  }

}