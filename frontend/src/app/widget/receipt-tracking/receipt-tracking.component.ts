import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  form: FormGroup = <FormGroup>{};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      products: this.fb.array([
        this.fb.group({
          product_name: ['', Validators.required],
          product_price: ['', Validators.required],
          produce_quantity: ['', Validators.required]
        })
      ]),      
      category_name: ['', Validators.required],
      reoccurring: ['', Validators.required],
      receipt_amount: ['', Validators.required],
      receipt_date: ['', Validators.required],
  });
  }

}
