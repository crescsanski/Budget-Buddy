import { Receipt } from 'src/app/models/receipt';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { MessageService, SelectItem } from 'primeng/api';
import { WidgetService } from '../widget.service';
import { ReceiptTrackService } from '../services/receipt-track.service';
import { ReceiptUploadService } from 'src/app/services/receipt-upload.service';
import { getLocaleDateFormat } from '@angular/common';
import { tap, throwIfEmpty } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  userReceipts: Receipt[] = [];
  noUpload = './../../../assets/icons/budget-icons/receipt.png'
  imageUpload: any = this.noUpload;
  inProgress: boolean[] = []
  receipts: any[] = [];
  numComp: number = 0;
  inSel: number = 0;
  totals: number[] = []
  updateObserv: Subscription;
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
    private as: AuthService,
    private fb: FormBuilder,
    private ts: TriggerService,
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
            receipt_is_reccuring: 0,
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
        receipt_is_reccuring: 0,
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
    this.resetForm();
  }

  getReceipt(i: number)
  {
    return this.form.controls[i] as FormGroup;
  }

  updateTotal(recInd: number)
  {
    var sum = 0
    for (let prod of this.getProducts(recInd).controls)
    {
      sum += prod.get('item_amount').value
    }
    this.totals[recInd] = sum
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

  resetForm()
  {
    this.updateObserv ? this.updateObserv.unsubscribe() : null;
    this.form = this.fb.array([
    ]);
  }

  onUpload(event) {
    console.log(event)
  
    let out = event.originalEvent.body;     

    this.resetForm();
    this.totals = Array(event.files.length)
    this.inProgress = Array(event.files.length).fill(true);
    this.numComp = 0;
    for(const [i, receipt] of event.files.entries()) {
        let data = out[receipt.name]
        let rec: Receipt = data
        this.loadForm(rec, i)
        this.updateTotal(i)

    }
    this.receiptUploaded = true;

    this.updateObserv = this.form.valueChanges.pipe(
      tap(() => {
        for (let i = 0; i < this.totals.length; i++)
        {
          this.updateTotal(i);
        }
      })
    ).subscribe()

    
    
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

  track(i: number)
  {
    let f = this.getReceipt(i)
    let pr = this.getProducts(i)

    if (f.valid)
    {
      var receipt: Receipt = {
        userid: this.as.currentUserValue.user_id,
        receipt:
        {
          receipt_date: f.get('receipt_date').value,
          receipt_is_income: false,
          receipt_is_reccuring: 0,
          receipt_name: f.get('receipt_name').value
        },
        expenses: []
      }

      for (let j = 0; j < pr.length; j++)
      {
        let product = this.getProduct(i, j);
        console.log(product.value)
        receipt.expenses.push(
          {
            expense_name: product.get('item_name').value,
            expense_price: product.get('item_amount').value,
            category: f.get('receipt_category').value
          }
        )
      }
      this.rs.addReceipt(receipt).subscribe(
        (val) =>
        {
          f.disable();
          this.inSel = (this.inSel == this.form.controls.length - 1) ? 0 : this.inSel + 1;
          this.inProgress[i] = false
          this.numComp += 1;
          if (this.numComp == this.form.controls.length)
          {
            this.receiptUploaded = false;
          }
          this.ts.announceExpenReceiptSubmit();
        }
      )
    }
  }


  selectReceipt(x: Receipt) {
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.showReceipt = true;
  }

}