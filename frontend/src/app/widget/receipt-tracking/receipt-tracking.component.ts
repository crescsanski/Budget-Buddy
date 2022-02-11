import { Receipt } from 'src/app/models/receipt';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  form: FormGroup = <FormGroup>{};
  userReceipts: Receipt[] = [];
  noUpload = './../../../assets/icons/budget-icons/receipt.png'
  imageUpload: string = this.noUpload;

  //mock receipt list

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userReceipts = [
      {receipt_id: 1, receipt_name: 'Walmart-Jan1', receipt_amount: 100, receipt_date: '1/1/2022', reccuring: 0, is_income: false, user: null},
      {receipt_id: 2, receipt_name: 'Stop and Shop', receipt_amount: 200, receipt_date: '1/1/2022', reccuring: 0, is_income: false, user: null},
    ]



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

  upload(){
    
  }

}
