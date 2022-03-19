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
import { QuickReceipt } from 'src/app/models/simReceipt';

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

    let out: QuickReceipt =
    {
      user_id: this.auServ.currentUserValue.user_id,
      receipt_amount: this.form.value['product_price'],
      receipt_name: this.form.value['product_name'],
      category: this.form.value['category'],
      receipt_date: this.form.value['receipt_date'],
      reccuring: false,
      is_income: false
    }

    this.rs.addQuickReceipt(out)
      .subscribe((res: any)=> {
        this.form.reset()
        out.receipt_id = res.receipt_id
        this.trigServ.announceExpenReceiptSubmit(this.rs.convert(out));
      }
      )
  }

}
