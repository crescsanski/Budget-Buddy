import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import { WidgetService } from '../widget.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss', './../small-widget/small-widget.component.scss']
})
export class TrackingComponent implements OnInit {
  form: FormGroup = <FormGroup>{};
  catOptions!: Category[];

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
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      receipt_date: ['', Validators.required],
      product_price: ['', Validators.required],
      product_name: ['', Validators.required],
      category: ['', Validators.required]
});

  }

  track() {
    if (this.form.invalid) {
      this.ms.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
      console.log(this.form.controls)
      return;
    }

    this.ws.basicSpendingTransaction(this.form.value)
      .subscribe(()=> {this.form.reset()}
      )
  }

}
