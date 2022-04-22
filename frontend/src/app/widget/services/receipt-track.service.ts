import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Receipt } from 'src/app/models/receipt';
import { QuickReceipt } from 'src/app/models/simReceipt';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment'



@Injectable({
  providedIn: 'root'
})
export class ReceiptTrackService {

  private apiUrl = 'api/receipt_track/';  // URL to web api
  private userReceipts: Receipt[]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  get receipts()
  {
    return this.userReceipts;
  }

  constructor(
    private http: HttpClient, private as: AuthService) { }

  /**GET receipts */
  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(`${this.apiUrl}users/${this.as.currentUserValue.user_id}/`).pipe(
      tap((receipts: Receipt[]) => {
        this.userReceipts = receipts;
        console.log("Fetched receipts")
      }),
      catchError(this.handleError<Receipt[]>('fetchReceipts'))
    )
  }

  /**DELETE a receipt and its contents */
  deleteReceipt(id: number): Observable<Receipt>
  {
    return this.http.delete(`${this.apiUrl}${id}/`).pipe(
      tap((receipt: Receipt) => {
        console.log(`Receipt deleted with id ${id}`)
      }),
      catchError(this.handleError<Receipt>('deleteReceipt'))
    )
  }

  /** POST: add a new receipt to the server */
  addReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.apiUrl, receipt, this.httpOptions).pipe(
      tap((newReceipt: Receipt) => console.log(`added receipt w/ id=${newReceipt.receipt_id}`)),
      catchError(this.handleError<Receipt>('addReceipt'))
    );
  }

    /** POST: add a new simple receipt with only a total amount */
    addQuickReceipt(receipt: QuickReceipt): Observable<QuickReceipt> {
      return this.http.post<QuickReceipt>(`${this.apiUrl}Simple`, receipt, this.httpOptions).pipe(
        tap((newReceipt: QuickReceipt) => console.log(`added receipt w/ id=${newReceipt.receipt_id}`)),
        catchError(this.handleError<QuickReceipt>('addReceipt'))
      );
    }

    updateReceipt(receipt: Receipt): Observable<any> {
      return this.http.put<Receipt>(`${this.apiUrl}/${receipt.receipt_id}/`, receipt, this.httpOptions).pipe(
        tap(_ => console.log(`updated receipt w/ id=${receipt.receipt_id}`)),
        catchError(this.handleError<Receipt>('updateReceipt'))
      );
    }

    convert(rec: QuickReceipt): Receipt
    {
      let trans: Receipt = <Receipt>{}
      trans.quick = true;
      trans.receipt_id = rec.receipt_id
      trans.userid = rec.user_id
      trans.receipt = {
        receipt_date: rec.receipt_date,
        receipt_is_income: rec.is_income,
        receipt_name: rec.receipt_name,
        receipt_is_reccuring: 0

      }
      if (rec.is_income)
      {
        trans.incomes = []
        trans.incomes.push({income_amount: rec.receipt_amount,
        income_name: rec.receipt_name, income_id: undefined, category_id: rec.category})
      }
      else
      {
        trans.expenses = []
        trans.expenses.push({expense_price: rec.receipt_amount,
          expense_name: rec.receipt_name, expense_id: undefined, category_id: rec.category})
      }
      return trans;
    }

    getTotal(receipt: Receipt)
    {
      if (receipt.receipt.receipt_is_income && receipt.incomes.length > 0)
      {
        return receipt.incomes.map(i => i.income_amount).reduce((a,b)=>a+b);
      }
      else if (receipt.expenses.length > 0)
      {
        return receipt.expenses.map(i => i.expense_price).reduce((a,b)=>a+b);
      }
      else
      {
        return 0;
      }
     
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
      //console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
