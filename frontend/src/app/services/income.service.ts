import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Income } from '../models/income';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class IncomeService {

  private incomesUrl = 'api/income/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET incomes from the server */
  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.incomesUrl)
      .pipe(
        tap(_ => this.log('fetched incomes')),
        catchError(this.handleError<Income[]>('getIncomes', []))
      );
  }

  /** GET income by id. Return `undefined` when id not found */
  getIncomeNo404<Data>(id: number): Observable<Income> {
    const url = `${this.incomesUrl}/?id=${id}`;
    return this.http.get<Income[]>(url)
      .pipe(
        map(incomes => incomes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} income id=${id}`);
        }),
        catchError(this.handleError<Income>(`getIncome id=${id}`))
      );
  }

  /** GET income by id. Will 404 if id not found */
  getIncome(id: number): Observable<Income> {
    const url = `${this.incomesUrl}/${id}`;
    return this.http.get<Income>(url).pipe(
      tap(_ => this.log(`fetched income id=${id}`)),
      catchError(this.handleError<Income>(`getIncome id=${id}`))
    );
  }

  /* GET incomes whose name contains search term */
  searchIncomes(term: string): Observable<Income[]> {
    if (!term.trim()) {
      // if not search term, return empty income array.
      return of([]);
    }
    return this.http.get<Income[]>(`${this.incomesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found incomes matching "${term}"`) :
         this.log(`no incomes matching "${term}"`)),
      catchError(this.handleError<Income[]>('searchIncomes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new income to the server */
  addIncome(income: Income): Observable<Income> {
    return this.http.post<Income>(this.incomesUrl, income, this.httpOptions).pipe(
      tap((newIncome: Income) => this.log(`added income w/ id=${newIncome.income_id}`)),
      catchError(this.handleError<Income>('addIncome'))
    );
  }

  /** DELETE: delete the income from the server */
  deleteIncome(id: number): Observable<Income> {
    const url = `${this.incomesUrl}/${id}`;

    return this.http.delete<Income>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted income id=${id}`)),
      catchError(this.handleError<Income>('deleteIncome'))
    );
  }

  /** PUT: update the income on the server */
  updateIncome(income: Income): Observable<any> {
    return this.http.put(this.incomesUrl, income, this.httpOptions).pipe(
      tap(_ => this.log(`updated income id=${income.income_id}`)),
      catchError(this.handleError<any>('updateIncome'))
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

      // TODO: better job of transforming error for income consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a IncomeService message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`IncomeService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/