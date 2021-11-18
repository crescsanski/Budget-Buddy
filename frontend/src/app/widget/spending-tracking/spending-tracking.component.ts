import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { concatMap, first, map, share } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { MessageService } from 'src/app/services/message.service';
import { ProductService } from 'src/app/services/product.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { WidgetService } from '../widget.service';

@Component({
  selector: 'app-spending-widget',
  templateUrl: './spending-tracking.component.html',
  styleUrls: ['./spending-tracking.component.scss'],
  providers: [DatePipe]
})
export class SpendingTrackingComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() smallSize: boolean = false;
  form: FormGroup = <FormGroup>{};
  imageUrl: string ='';
  catOptions!: Category[];
  
  constructor(private fb: FormBuilder, 
    private messageService: MessageService,
    private cs: CategoryService,
    private as: AuthService,
    private ps: ProductService,
    private ws: WidgetService,
    private rs: ReceiptService,
    private dp: DatePipe) 
  { 
    this.cs.getCategories().subscribe(
      (cats: Category[]) => 
      {
        this.catOptions = cats;
      }
    )

    this.ws.testFunction();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
        receipt_date: ['', Validators.required],
        receipt_amount: ['', Validators.required],
        category: ['', Validators.required],
  });
  }

  onSubmit()
  {
    if (this.form.invalid) {
      this.messageService.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
      return;
    }

    this.ws.basicSpendingTransaction(this.form.value)
      .pipe(share())
  }

      // convenience getter for easy access to form fields
      get f() { return this.form.controls; }


}
