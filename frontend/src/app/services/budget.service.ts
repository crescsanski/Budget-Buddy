import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Budget } from '../models/budget';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';
import { BudgetTotals } from '../models/spendBudget';
import { User } from '../models/user';
import { BudgetCategory } from '../models/formModels/budgetCategory';
import { TimeService } from './time.service';


@Injectable({ providedIn: 'root' })
export class BudgetService {

  private budgetsUrl = 'api/budget/';  // URL to web api
  user: User | null = null;
  private bud_Calcs: BudgetTotals[] = [];
  private curMonthCalcs: BudgetTotals;
  private exBudCat: Budget[]
  private inBudCat: Budget[]

  get budCalcs()
  {
    return this.bud_Calcs;
  }

  get curBudCalcs()
  {
    return this.curMonthCalcs;
  }

  get exBudByCat()
  {
    return this.exBudCat;
  }

  get inBudByCat()
  {
    return this.inBudCat;
  }

  types = [
    {label: 'Want', value: 'want'},
    {label: 'Need', value: 'need'},
    {label: 'Savings', value: 'saving'}
  ]


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authServ: AuthService, private ts: TimeService) { 
      this.authServ.currentUser.subscribe(x => this.user = <User>x);
    }

  /**Update altered amounts in budget */
  updateBudget(budgets: Budget[]): Observable<any> {
    const url = `${this.budgetsUrl}users/${this.user.user_id}/`
    const object = {
      budgets: budgets
    }
    return this.http.put(url, object, this.httpOptions)
    .pipe(
      tap(_ => console.log('updated budgets')),
      catchError(this.handleError<any>('updateBudgets', 'error'))
    )
  }

  /**Reset budget for current month (delete all budget entries for current month) */
  resetBudget(): Observable<any> {
    const url = `${this.budgetsUrl}users/${this.user.user_id}/`
    return this.http.delete(url, this.httpOptions)
    .pipe(
      tap(_ => console.log('reset budget')),
      catchError(this.handleError<any>('deleteBudgets', 'error'))
    )
  }

  /**Set initial budget */
  setInitialBudget(budgets: Budget[]): Observable<any> {
    const object = {
      user_id: this.user.user_id,
      budgets: budgets
    }
    return this.http.post(this.budgetsUrl, object, this.httpOptions)
    .pipe(
      tap(_ => console.log('set initial budgets')),
      catchError(this.handleError<any>('initBudgets', 'error'))
    )
  }

  /**GET User's Budgets */
  getBudByCat(): Observable<Budget[]>
  {
    const url = `${this.budgetsUrl}users/${this.user.user_id}/`
    return this.http.get<Budget[]>(url).pipe(
      tap((out: Budget[]) => 
      {
        console.log(`Fetched budgets by category`)
        let inc = out.filter(value => value.category_type == "income")  
        let exp = out.filter(value => value.category_type != "income")
        this.exBudCat = exp;
        this.inBudCat = inc;
      }),
      catchError(this.handleError<Budget[]>(`getBudByCat`))
    )
  }

  /**GET User's Budget Totals */
  getBudgetTotals(): Observable<BudgetTotals[]> {
    return this.http.get<BudgetTotals[]>(`${this.budgetsUrl}users/${this.user.user_id}/totals`).pipe(
    tap((out: BudgetTotals[]) => 
      {
        console.log(`Fetched budget totals`)
        if (out && out.length > 0)
        {
          this.bud_Calcs = out;
          let temp = out.filter(val => val.year == this.ts.year && val.month == this.ts.month)
          temp && temp.length > 0 ? this.curMonthCalcs = temp[0] : this.curMonthCalcs = {weeklyBudgetTotal: 0, monthlyBudgetTotal: 0, monthlyEstIncome: 0, month: this.ts.month, year: this.ts.year}
        }
        else
        {
          this.bud_Calcs = [{weeklyBudgetTotal: 0, monthlyBudgetTotal: 0, monthlyEstIncome: 0, month: 0, year: 0}]
          this.curMonthCalcs = {weeklyBudgetTotal: 0, monthlyBudgetTotal: 0, monthlyEstIncome: 0, month: 0, year: 0}
        }
        
      }),
    catchError(this.handleError<BudgetTotals[]>(`getBudgetTotals`))
  );
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

      // TODO: better job of transforming error for budget consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a BudgetService message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`BudgetService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/