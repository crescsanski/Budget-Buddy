import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Budget } from '../models/budget';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';
import { SpendBudget } from '../models/spendBudget';
import { User } from '../models/user';
import { BudgetCategory } from '../models/formModels/budgetCategory';


@Injectable({ providedIn: 'root' })
export class BudgetService {

  private budgetsUrl = 'api/budget/';  // URL to web api
  user: User | null = null;
  private spenBudCalcs: SpendBudget[] = [];
  private exBudCat: BudgetCategory[]
  private inBudCat: BudgetCategory[]

  get spendBudCalcs()
  {
    return this.spenBudCalcs;
  }

  set spendBudCalcs(value)
  {
    this.spenBudCalcs = value;
  }

  get exBudByCat()
  {
    return this.exBudCat;
  }

  get inBudByCat()
  {
    return this.inBudCat;
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authServ: AuthService) { 
      this.authServ.currentUser.subscribe(x => this.user = <User>x);
    }

  /** GET budgets from the server */
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.budgetsUrl)
      .pipe(
        tap(_ => console.log('fetched budgets')),
        catchError(this.handleError<Budget[]>('getBudgets', []))
      );
  }

  /**GET User's Budgets */
  getBudByCat(): Observable<BudgetCategory[]>
  {
    const url = `${this.budgetsUrl}users/${this.user.user_id}/`
    return this.http.get<BudgetCategory[]>(url).pipe(
      tap((out: BudgetCategory[]) => 
      {
        console.log(`Fetched budgets by category`)
        let inc = out.filter(value => value.category_type == "income")  
        let exp = out.filter(value => value.category_type != "income")
        this.exBudCat = exp;
        this.inBudCat = inc;
      }),
      catchError(this.handleError<BudgetCategory[]>(`getBudByCat`))
    )
  }

  /**GET User's Budget Spending Totals */
  getSpendBudget(): Observable<SpendBudget[]> {
    return this.http.get<SpendBudget[]>(`${this.budgetsUrl}users/${this.user.user_id}/SpendingBudget`).pipe(
    tap((out: SpendBudget[]) => 
      {
        console.log(`Fetched budget spending totals: ${out}`)
        if (out && out.length > 0)
        {
          this.spenBudCalcs = out;
        }
        else
        {
          this.spenBudCalcs = [{weeklyBudgetTotal: 0, monthlyBudgetTotal: 0, month: 0, year: 0}]
        }
        
      }),
    catchError(this.handleError<SpendBudget[]>(`getSpendBudget`))
  );
}


  /** GET budget by id. Return `undefined` when id not found */
  getBudgetNo404<Data>(id: number): Observable<Budget> {
    const url = `${this.budgetsUrl}/?id=${id}`;
    return this.http.get<Budget[]>(url)
      .pipe(
        map(budgets => budgets[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`${outcome} budget id=${id}`);
        }),
        catchError(this.handleError<Budget>(`getBudget id=${id}`))
      );
  }

  /** GET budget by id. Will 404 if id not found */
  getBudget(id: number): Observable<Budget> {
    const url = `${this.budgetsUrl}/${id}`;
    return this.http.get<Budget>(url).pipe(
      tap(_ => console.log(`fetched budget id=${id}`)),
      catchError(this.handleError<Budget>(`getBudget id=${id}`))
    );
  }

  /* GET budgets whose name contains search term */
  searchBudgets(term: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.budgetsUrl}?user=${term}`).pipe(
      tap(x => x.length ?
         console.log(`found budgets matching "${term}"`) :
         console.log(`no budgets matching "${term}"`)),
      catchError(this.handleError<Budget[]>('searchBudgets', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new budget to the server */
  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.budgetsUrl, budget, this.httpOptions).pipe(
      tap((newBudget: Budget) => console.log(`added budget w/ id=${newBudget.budget_id}`)),
      catchError(this.handleError<Budget>('addBudget'))
    );
  }

  /** DELETE: delete the budget from the server */
  deleteBudget(id: number): Observable<Budget> {
    const url = `${this.budgetsUrl}/${id}`;

    return this.http.delete<Budget>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted budget id=${id}`)),
      catchError(this.handleError<Budget>('deleteBudget'))
    );
  }

  /** PUT: update the budget on the server */
  updateBudget(budget: Budget): Observable<any> {
    return this.http.put(`${this.budgetsUrl}${budget.budget_id}/`, budget, this.httpOptions).pipe(
      tap(_ => console.log(`updated budget id=${budget.budget_id}`)),
      catchError(this.handleError<any>('updateBudget'))
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