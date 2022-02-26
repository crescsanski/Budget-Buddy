import { Receipt } from 'src/app/models/receipt';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { MessageService, SelectItem } from 'primeng/api';
import { WidgetService } from '../widget.service';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  userReceipts: Receipt[] = [];
  noUpload = './../../../assets/icons/budget-icons/receipt.png'
  imageUpload: any = this.noUpload;
  receipts: any[] = [];
  selectedReceipt: Receipt;
  showReceipt = false;
  receiptUploaded = false;
  form: FormGroup = <FormGroup>{};
  catOptions!: Category[];
  frequencyOptions!: SelectItem[];
  uploadedReceipt: Receipt;

  //mock receipt list

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
      this.uploadedReceipt = {receipt_id: 0, receipt_name: 'Test Receipt', receipt_amount: 0, receipt_date: '', reccuring: 0,  is_income: false, user: null};

      this.frequencyOptions = this.ws.frequencyOptions;

    this.userReceipts = [
      { receipt_id: 1, receipt_name: 'Walmart', receipt_amount: 100, receipt_date: '2.22.22', reccuring: 0,  is_income: false, user: 1},
      { receipt_id: 1, receipt_name: 'Target', receipt_amount: 200, receipt_date: '2.22.22', reccuring: 0,  is_income: false, user: 1}
    ]

    this.selectedReceipt = {receipt_amount: null, receipt_date: null, reccuring: 0,  is_income: false, user: null};
    
    this.receiptUploaded = true;
  }

  ngOnInit(): void {
    
    console.log(this.userReceipts)
    this.form = this.fb.group({
      products: this.fb.array([
        this.fb.group({
          receipt_name: ['', Validators.required],
          receipt_amount: ['', Validators.required],
        })
      ]),      
      receipt_category: ['', Validators.required],
      reoccurring: ['', Validators.required],
      receipt_amount: ['', Validators.required],
      receipt_date: ['', Validators.required],
  });
  }

  onUpload(event) {
    for(let receipt of event.files) {
        this.receipts.push(receipt);
    }
  }


  selectReceipt(x: Receipt) {
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.showReceipt = true;
  }

}
