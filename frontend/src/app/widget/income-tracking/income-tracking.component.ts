import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import { CategoryService } from '../../services/category.service';
import {SelectItem} from 'primeng/api';
import { ReceiptService } from 'src/app/services/receipt.service';
import { AuthService } from 'src/app/services/auth.service';
import { Receipt } from 'src/app/models/receipt';
import { WidgetService } from '../widget.service';
import { ReceiptTrackService } from '../services/receipt-track.service';
import { TriggerService } from 'src/app/services/trigger.service';
import { QuickReceipt } from 'src/app/models/simReceipt';

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
    private rs: ReceiptTrackService,
    private auServ: AuthService,
    private ws: WidgetService,
    private trigServ: TriggerService,
    private fb: FormBuilder,
    private cs: CategoryService) { 

      this.catOptions = this.cs.incomeCats;
    
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

    let out: QuickReceipt =
    {
      user_id: this.auServ.currentUserValue.user_id,
      receipt_amount: this.form.value['income_amount'],
      receipt_name: this.form.value['income_name'],
      category: this.form.value['category'],
      receipt_date: this.form.value['receipt_date'],
      reccuring: false,
      is_income: true
    }

    this.rs.addQuickReceipt(out)
      .subscribe(()=> {
        this.form.reset()
        this.trigServ.announceIncomReceiptSubmit();
      }
      )
  }

}