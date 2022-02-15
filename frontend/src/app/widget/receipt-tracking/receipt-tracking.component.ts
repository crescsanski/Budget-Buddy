import { Receipt } from 'src/app/models/receipt';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuickReceipt } from 'src/app/models/simReceipt';
import { ReceiptUploadService } from 'src/app/services/receipt-upload.service';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  form: FormGroup = <FormGroup>{};
  userReceipts: QuickReceipt[] = [];
  noUpload = './../../../assets/icons/budget-icons/receipt.png'
  imageUpload: any = this.noUpload;
  receipts: any[] = [];
  url: string;

  //mock receipt list

  constructor(private fb: FormBuilder, public upServ: ReceiptUploadService) { 
  }

  ngOnInit(): void {
    this.userReceipts = [
      {receipt_id: 1, category: 1, receipt_name: 'Walmart-Jan1', receipt_amount: 100, receipt_date: '1/1/2022', reccuring: false, is_income: false},
      {receipt_id: 2, category: 1, receipt_name: 'Stop and Shop', receipt_amount: 200, receipt_date: '1/1/2022', reccuring: false, is_income: false},
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


  onUpload(event) {
    console.log(event)
  
    let out = event.originalEvent.body;     

    for(let receipt of event.files) {
        let data = out[receipt.name]
        let quick: QuickReceipt = {receipt_name: data.receipt.receipt_name, receipt_date: data.receipt.receipt_date,
          reccuring: false, receipt_amount: 0, is_income: false, category: 0}
          this.userReceipts.push(quick)
        this.receipts.push(receipt);
    }
  }

}
