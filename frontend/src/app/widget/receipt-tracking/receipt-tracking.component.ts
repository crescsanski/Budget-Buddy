import { Receipt } from 'src/app/models/receipt';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { MessageService, SelectItem } from 'primeng/api';
import { WidgetService } from '../widget.service';
import { ReceiptTrackService } from '../services/receipt-track.service';
import { ReceiptUploadService } from 'src/app/services/receipt-upload.service';
import { getLocaleDateFormat } from '@angular/common';

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
  form: FormArray = <FormArray>{};
  catOptions!: Category[];
  frequencyOptions!: SelectItem[];
  uploadedReceipt: Receipt;

  //mock receipt list

  constructor(private ms: MessageService,
    private ws: WidgetService,
    private fb: FormBuilder,
    public upServ: ReceiptUploadService,
    public rs: ReceiptTrackService,
    private cs: CategoryService) { 

      this.catOptions = this.cs.expenseCats
        

  
      
      //TODO: Implement w/ API
      this.uploadedReceipt = {receipt: null, expenses: null};

      this.frequencyOptions = this.ws.frequencyOptions;

    this.userReceipts = [
      {
        
        receipt: {
            receipt_date: new Date().toDateString(),
            receipt_is_reccuring: false,
            receipt_is_income: false,
            receipt_name: 'Walmart',
        },
        expenses: [
          {
            expense_name: "Water",
            expense_price: 4.23,
            category: null
          }
        ] 
    },
    ]

    this.selectedReceipt = {
        
      receipt: {
        receipt_date: new Date().toDateString(),
        receipt_is_reccuring: false,
        receipt_is_income: false,
        receipt_name: 'Target',
    },
    expenses: [
      {
        expense_name: "Shampoo",
        expense_price: 4.23,
        category: null
      }
    ] 
}
    
    //this.receiptUploaded = true;
  }

  ngOnInit(): void {
    
    console.log(this.userReceipts)
    this.form = this.fb.array([
     ]);
  }

  getReceipt(i: number)
  {
    return this.form.controls[i] as FormGroup;
  }

  getProducts(recIn: number)
  {
    return this.getReceipt(recIn).get('products') as FormArray;
  }

  getProduct(recIn: number, i: number)
  {
    return this.getProducts(recIn).controls[i] as FormGroup;
  }

  addReceipt(cat: number, rec: boolean, date: string, name: string)
  {
    this.form.push(
      this.fb.group({
        products: this.fb.array(Array<FormGroup>()),      
        receipt_category: [cat, Validators.required],
        reoccurring: [rec, Validators.required],
        receipt_date: [date, Validators.required],
        receipt_name: [name, Validators.required],
    })
    )
  }

  addEmptyProduct(recIn: number) {
    this.getProducts(recIn).push(
      this.fb.group({
        item_name: ['', Validators.required],
        item_amount: ['', Validators.required]
      })
    )
  }

  addProduct(recIn: number, name: string, amount: number) {
    this.getProducts(recIn).push(
      this.fb.group({
        item_name: [name, Validators.required],
        item_amount: [amount, Validators.required]
      })
    )
  }

  removeProduct(recIn: number, index: number)
  {
    this.getProducts(recIn).removeAt(index);
  }

  onUpload(event) {
    console.log(event)
  
    let out = event.originalEvent.body;     

    this.form.reset()

    for(const [i, receipt] of event.files.entries()) {
        let data = out[receipt.name]
        let rec: Receipt = data
        this.loadForm(rec, i)

    }
    this.receiptUploaded = true;
    
  }

  loadForm(receipt: Receipt, coun: number)
  {
    this.addReceipt(null, false, receipt.receipt.receipt_date,
      receipt.receipt.receipt_name
    )

    for (let ex of receipt.expenses)
    {
      this.addProduct(coun, ex.expense_name, ex.expense_price)
    }

    
  }


  selectReceipt(x: Receipt) {
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.showReceipt = true;
  }

}