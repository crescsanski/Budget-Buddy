import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Budget } from '../models/budget';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class BudgetService {

  private budgetsUrl = 'api/budgets/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET budgets from the server */
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.budgetsUrl)
      .pipe(
        tap(_ => this.log('fetched budgets')),
        catchError(this.handleError<Budget[]>('getBudgets', []))
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
          this.log(`${outcome} budget id=${id}`);
        }),
        catchError(this.handleError<Budget>(`getBudget id=${id}`))
      );
  }

  /** GET budget by id. Will 404 if id not found */
  getBudget(id: number): Observable<Budget> {
    const url = `${this.budgetsUrl}/${id}`;
    return this.http.get<Budget>(url).pipe(
      tap(_ => this.log(`fetched budget id=${id}`)),
      catchError(this.handleError<Budget>(`getBudget id=${id}`))
    );
  }

  /* GET budgets whose name contains search term */
  searchBudgets(term: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.budgetsUrl}?user=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found budgets matching "${term}"`) :
         this.log(`no budgets matching "${term}"`)),
      catchError(this.handleError<Budget[]>('searchBudgets', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new budget to the server */
  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.budgetsUrl, budget, this.httpOptions).pipe(
      tap((newBudget: Budget) => this.log(`added budget w/ id=${newBudget.budget_id}`)),
      catchError(this.handleError<Budget>('addBudget'))
    );
  }

  /** DELETE: delete the budget from the server */
  deleteBudget(id: number): Observable<Budget> {
    const url = `${this.budgetsUrl}/${id}`;

    return this.http.delete<Budget>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted budget id=${id}`)),
      catchError(this.handleError<Budget>('deleteBudget'))
    );
  }

  /** PUT: update the budget on the server */
  updateBudget(budget: Budget): Observable<any> {
    return this.http.put(`${this.budgetsUrl}${budget.budget_id}/`, budget, this.httpOptions).pipe(
      tap(_ => this.log(`updated budget id=${budget.budget_id}`)),
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
      this.log(`${operation} failed: ${error.message}`);

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