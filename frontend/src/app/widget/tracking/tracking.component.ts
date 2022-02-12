import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import { CategoryService } from '../../services/category.service';
import { SelectItem } from 'primeng/api';
import { Receipt } from 'src/app/models/receipt';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptTrackService } from '../services/receipt-track.service';
import { WidgetService } from '../widget.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss', './../small-widget/small-widget.component.scss']
})
export class TrackingComponent implements OnInit {
  form: FormGroup = <FormGroup>{};
  catOptions!: Category[];
  frequencyOptions!: SelectItem[];

  constructor(private ms: MessageService,
    private fb: FormBuilder,
    private rs: ReceiptTrackService,
    private trigServ: TriggerService,
    private ws: WidgetService,
    private auServ: AuthService,
    private cs: CategoryService) { 
      this.catOptions = this.cs.expenseCats;

      this.frequencyOptions = this.ws.frequencyOptions;

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      receipt_date: ['', Validators.required],
      product_price: ['', Validators.required],
      product_name: ['', Validators.required],
      category: ['', Validators.required],
      reocurring: ['']
});

  }

  track() {

    if (this.form.invalid) {
      this.ms.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
      return;
    }

    let out: Receipt =
    {
      userid: this.auServ.currentUserValue.user_id,
      expenses: [
        {
        expense_price: this.form.value['product_price'],
        expense_name: this.form.value['product_name'],
        category: this.form.value['category'],
        expense_is_essential: true
        }
      ],
      receipt:
      {
        receipt_name: this.form.value['product_name'],
        receipt_date: this.form.value['receipt_date'],
        receipt_is_reccuring: this.form.value['reocurring'],
        receipt_is_income: false
      }
    }

    this.rs.addReceipt(out)
      .subscribe(()=> {
        this.form.reset();
        this.trigServ.announceExpenReceiptSubmit();
      }
      )
  }

}
