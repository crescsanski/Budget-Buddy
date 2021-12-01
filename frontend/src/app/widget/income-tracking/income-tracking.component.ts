import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import { WidgetService } from '../widget.service';
import { CategoryService } from '../../services/category.service';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-income-tracking',
  templateUrl: './income-tracking.component.html',
  styleUrls: ['./../tracking/tracking.component.scss', './../small-widget/small-widget.component.scss']
})
export class IncomeTrackingComponent implements OnInit {
form: FormGroup = <FormGroup>{};
  catOptions!: Category[];
  frequencyOptions!: SelectItem[];

  constructor(private ms: MessageService,
    private ws: WidgetService,
    private fb: FormBuilder,
    private cs: CategoryService) { 
      this.cs.getIncomeCategories().subscribe(
        (cats: Category[]) => 
        {
          this.catOptions = cats;
        }
      )
      
      //TODO: Implement w/ API
      this.frequencyOptions = this.ws.frequencyOptions;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      income_name: ['', Validators.required],
      receipt_date: ['', Validators.required],
      income_amount: ['', Validators.required],
      category: ['', Validators.required],
      reocurring: ['']
});

  }

  track() {
    if (this.form.invalid) {
      this.ms.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
      return;
    }

    this.ws.basicIncomeTransaction(this.form.value)
      .subscribe(()=> {this.form.reset()}
      ) 
  }

}