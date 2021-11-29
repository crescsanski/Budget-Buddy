import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, map, share, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { MessageService } from '../services/message.service';
import { ProductService } from '../services/product.service';
import { ReceiptService } from '../services/receipt.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../models/product';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Receipt } from '../models/receipt';
import { BasicManualSpend } from '../models/formModels/basicManualSpend';
import { Income } from '../models/income';
import { BasicManualIncome } from '../models/formModels/basicManualIncome';
import { IncomeService } from '../services/income.service';


@Injectable({ providedIn: 'root'
})
export class WidgetService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private as: AuthService,
    private ps: ProductService,
    private rs: ReceiptService,
    private is: IncomeService,
    private cs: CategoryService,
    private dp: DatePipe) { 



    }

    //use for testing purposes of manual spending function
    testFunction()
    {
        let inp: BasicManualSpend = {  receipt_date: new Date(),
        product_price: 25.23,
        product_name: "Soap",
        category: 1}
        this.basicSpendingTransaction(inp).pipe(share())
    }

    /**
   * This is designed to input a spending transaction for an individual product on its own receipt.  It will be used
   * by the spending-tracking widget.  In the desktop interface, we may add a non-widget for spending that would allow the input of multiple 
   * products for a given receipt.
   */
    basicSpendingTransaction(inp: BasicManualSpend): Observable<Product>
    {
        return this.rs.addReceipt({
            receipt_date: this.dp.transform(inp.receipt_date, 'yyyy-MM-dd'),
            is_income: '0', reoccuring: '0',
            receipt_amount: inp.product_price,
            user: this.as.currentUserValue.user_id})
            .pipe(
              concatMap((rec: Receipt) =>
              {
                return this.ps.addProduct({
                  product_name: inp.product_name,
                  product_price: inp.product_price,
                  category: inp.category,
                  receipt: rec.receipt_id
                })
              }),
            map((res: Product) => {
                this.messageService.addSuccess('Spending Recorded Successfully', "");
            }),
            catchError(err => 
              {
                this.messageService.addError('Spending Failed to Be Recorded!', "");
                return of('error', err);
              }));
        
    }

     /**
   * This is designed to input an income transaction for an individual income source on its own receipt.  It will be used
   * by the income-tracking widget. 
   */
      basicIncomeTransaction(inp: BasicManualIncome): Observable<Income>
      {
          return this.rs.addReceipt({
              receipt_date: this.dp.transform(inp.receipt_date, 'yyyy-MM-dd'),
              is_income: '1', reoccuring: '0',
              receipt_amount: inp.income_amount,
              user: this.as.currentUserValue.user_id})
              .pipe(
                concatMap((rec: Receipt) =>
                {
                  return this.is.addIncome({
                    income_name: inp.income_name,
                    income_amount: inp.income_amount,
                    category: inp.category as number,
                    receipt: rec.receipt_id
                  })
                }),
              map((res: Income) => {
                  this.messageService.addSuccess('Income Recorded Successfully', "");
              }),
              catchError(err => 
                {
                  this.messageService.addError('Income Failed to Be Recorded!', "");
                  return of('error', err);
                }));
          
      }

  

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`UserService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

