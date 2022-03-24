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
import { QuickReceipt } from 'src/app/models/simReceipt';

@Component({
  selector: 'app-receipt-tracking',
  templateUrl: './receipt-tracking.component.html',
  styleUrls: ['./receipt-tracking.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ReceiptTrackingComponent implements OnInit {

  viewAllReceipts = false;
  allReceipts: Receipt[] = [];
  userReceipts: Receipt[] = [];
  noUpload = './../../../assets/icons/budget-icons/receipt.png'
  imageUpload: any = this.noUpload;
  inProgress: boolean[] = []
  receipts: any[] = [];
  loading: boolean = false;
  load: boolean[] = []
  numComp: number = 0;
  inSel: number = 0;
  totals: number[] = []
  updateObserv: Subscription;
  selectedReceipt: Receipt;
  showReceipt = false;
  receiptUploaded = false;
  form: FormArray = <FormArray>{};
  catOptions!: Category[];
  incCatOptions: Category[];
  frequencyOptions!: SelectItem[];
  uploadedReceipt: Receipt;
  editReceipt = false;
  deleteReceipt = false;
  tyOptions: SelectItem<boolean>[] = [{label: "Income", value: true}, {label: "Spending", value: false}]



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
      this.incCatOptions = this.cs.incomeCats;

  
      
      //TODO: Implement w/ API
      this.uploadedReceipt = {receipt: null, expenses: null};

      this.frequencyOptions = this.ws.frequencyOptions;

      this.userReceipts = this.rs.receipts.slice(-4)

      this.allReceipts = this.rs.receipts;

      this.ts.expenReceiptAnnounced$.subscribe((rec: Receipt | QuickReceipt) =>
      {
        this.loadTable(rec);
        
      })

      this.ts.incomReceiptAnnounced$.subscribe((rec: Receipt | QuickReceipt) => {
        this.loadTable(rec);
      })

    this.selectedReceipt = this.getBlankReceipt();
    
  }

  //Remove the oldest item in the table and replace it with the new receipt
  loadTable(rec: Receipt | QuickReceipt)
  {
    this.userReceipts = this.userReceipts.slice(1); //remove the oldest record
    if ((rec as Receipt).incomes || (rec as Receipt).expenses)
    {
      //This is a standard receipt
      this.userReceipts.push(rec);
    }
    else
    {
      //This is a quick receipt
      let convert = this.rs.convert(rec as QuickReceipt);
      this.userReceipts.push({...rec, quick: true})
    }     
  }

  getBlankReceipt(): Receipt
  {
    return {
        
      receipt: {
          receipt_date: null,
          receipt_is_reccuring: 0,
          receipt_is_income: false,
          receipt_name: null,
      },
      receipt_id: null,
      expenses: [
        {
          expense_name: null,
          expense_id: null,
          expense_price: null,
          category_id: null
        }
      ]
  };
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
    for (let prod of this.getItems(recInd).controls)
    {
      sum += prod.get('item_amount').value
    }
    this.totals[recInd] = sum
  }

  getItems(recIn: number)
  {
    return this.getReceipt(recIn).get('items') as FormArray;
  }

  getItem(recIn: number, i: number)
  {
    return this.getItems(recIn).controls[i] as FormGroup;
  }

  addReceipt(cat: number, rec: boolean, date: string, name: string, id: number, is_income: boolean)
  {
    console.log("Date: ", date.length)
    this.form.push(
      this.fb.group({
        items: this.fb.array(Array<FormGroup>()),      
        receipt_category: [cat, Validators.required],
        receipt_date: [date.length > 0 ? new Date(date) : new Date(), Validators.required],
        receipt_name: [name, Validators.required],
        receipt_is_income: [is_income, Validators.required],
        receipt_id: [id]
    })
    )
  }

  addEmptyItem(recIn: number) {
    this.getItems(recIn).push(
      this.fb.group({
        item_name: ['', Validators.required],
        item_amount: ['', Validators.required]
      })
    )
  }

  addItem(recIn: number, name: string, amount: number, id: number) {
    this.getItems(recIn).push(
      this.fb.group({
        item_name: [name, Validators.required],
        item_amount: [amount, Validators.required],
        item_id: [id]
      })
    )
  }

  removeItem(recIn: number, index: number)
  {
    this.getItems(recIn).removeAt(index);
  }

  resetForm()
  {
    this.updateObserv ? this.updateObserv.unsubscribe() : null;
    this.form = this.fb.array([
    ]);
  }

  onUpload(event) {
    console.log(event)
    this.loading = false;
    let out = event.originalEvent.body;     

    this.resetForm();
    this.totals = Array(event.files.length)
    this.inProgress = Array(event.files.length).fill(true);
    this.load = Array(event.files.length).fill(false)
    this.numComp = 0;
    for(const [i, receipt] of event.files.entries()) {
        let data = out[receipt.name]
        let rec: Receipt = data
        //set the type to spending
        rec.receipt.receipt_is_income = false;
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
    var category = undefined
    if (receipt.receipt.receipt_is_income && receipt.incomes.length > 0)
    {
      category = receipt.incomes[0].category_id
    }
    else if (receipt.expenses.length > 0)
    {
      category = receipt.expenses[0].category_id;
    }

    this.addReceipt(category, false, receipt.receipt.receipt_date,
      receipt.receipt.receipt_name, receipt.receipt_id, receipt.receipt.receipt_is_income
    )

    if (receipt.expenses && receipt.expenses.length > 0)
    {
      for (let ex of receipt.expenses)
      {
        this.addItem(coun, ex.expense_name, ex.expense_price, ex.expense_id)
      }
    }

    if (receipt.incomes && receipt.incomes.length > 0)
    {
      for (let inc of receipt.incomes)
      {
        this.addItem(coun, inc.income_name, inc.income_amount, inc.income_id)
      }
    }

  }

  fromFormToReceipt(i: number): Receipt
  {
    let f = this.getReceipt(i)
    let pr = this.getItems(i)

    if (f.valid)
    {
      var receipt: Receipt = {
        userid: this.as.currentUserValue.user_id,
        receipt_id: f.get('receipt_id').value,
        receipt:
        {
          receipt_date: f.get('receipt_date').value,
          receipt_is_income: f.get('receipt_is_income').value,
          receipt_is_reccuring: 0,
          receipt_name: f.get('receipt_name').value
        },
        expenses: []
      }

      if (receipt.receipt.receipt_is_income)
      {
        receipt.incomes = []
        for (let j = 0; j < pr.length; j++)
        {
          let item = this.getItem(i, j);
          receipt.incomes.push(
            {
              income_name: item.get('item_name').value,
              income_id: item.get('item_id') ? item.get('item_id').value : undefined,
              income_amount: item.get('item_amount').value,
              category_id: f.get('receipt_category').value
            }
          )
        }
      }
      else
      {
        receipt.expenses = []
        for (let j = 0; j < pr.length; j++)
        {
          let item = this.getItem(i, j);
          receipt.expenses.push(
            {
              expense_name: item.get('item_name').value,
              expense_id: item.get('item_id') ? item.get('item_id').value : undefined,
              expense_price: item.get('item_amount').value,
              category_id: f.get('receipt_category').value
            }
          )
        }
      }

      
    }
    return receipt;
  }

  track(i: number)
  {
      this.load[i] = true;
      let receipt = this.fromFormToReceipt(i);
      this.rs.addReceipt(receipt).subscribe(
        (val: Receipt) =>
        {
          receipt.receipt_id = val.receipt_id;
          this.userReceipts.push(receipt)
          this.inSel = (this.inSel == this.form.controls.length - 1) ? 0 : this.inSel + 1;
          this.inProgress[i] = false
          this.load[i] = true
          this.numComp += 1;
          if (this.numComp == this.form.controls.length)
          {
            this.receiptUploaded = false;
          }
          if (receipt.receipt.receipt_is_income)
          {
            this.ts.announceIncomReceiptSubmit(receipt)
          }
          else
          {
            this.ts.announceExpenReceiptSubmit(receipt);
          } 
        }
      )
    }

  setTotalUpdates()
  {
    this.updateObserv = this.form.valueChanges.pipe(
      tap(() => {
        for (let i = 0; i < this.totals.length; i++)
        {
          this.updateTotal(i);
        }
      })
    ).subscribe()
  }


  selectReceipt(x: Receipt) {
    console.log("hello")
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.showReceipt = true;
  }

  prepareFormForEdit()
  {
    this.resetForm();
    this.totals = Array(1)
    this.inProgress = Array(1).fill(true);
    this.load = Array(1).fill(false)

    
  }

  openReceiptEditor(x: Receipt) {
    this.editReceipt = false;
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.prepareFormForEdit();
    this.loadForm(this.selectedReceipt, 0)
    this.setTotalUpdates();
    this.updateTotal(0);
    this.editReceipt = true;
  }

  openDeleteReceipt(x: Receipt) {
    this.editReceipt = false;
    this.showReceipt = false;
    this.selectedReceipt = null;
    this.selectedReceipt = x;
    this.deleteReceipt = true;
  }

  getOptions(receiptId: number)
  {
    let is_income = this.getReceipt(receiptId).get('receipt_is_income').value
    if (is_income)
    {
      return this.incCatOptions;
    }
    else
    {
      return this.catOptions;
    }
  }

  updateReceipt(){
    //TO DO: update receipt API call
    this.load[0] = true;
    let receipt = this.fromFormToReceipt(0);
    this.rs.updateReceipt(receipt).subscribe(() =>
      {
        this.selectedReceipt = receipt;
        let index = this.userReceipts.findIndex(i => i.receipt_id == receipt.receipt_id)
        this.userReceipts[index] = receipt;
        this.editReceipt = false;
        this.load[0] = false;
      })
  }

  confirmDeleteReceipt(){
    //TO DO: delete receipt API call
    this.rs.deleteReceipt(this.selectedReceipt.receipt_id).subscribe(
      (val) => {
        let index = this.userReceipts.findIndex(i => i.receipt_id == this.selectedReceipt.receipt_id)
        this.userReceipts.splice(index, 1)
        this.selectedReceipt = this.getBlankReceipt();
        this.deleteReceipt = false;
      }
    );

  }

  denyDeleteReceipt(){
    this.deleteReceipt=false;
  }

  showAllReceipts() {
    this.viewAllReceipts = true;
  }

}
