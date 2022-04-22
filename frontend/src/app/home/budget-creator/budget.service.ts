import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BudgetPackage } from 'src/app/models/budgetPackage';
import { environment } from '../../../environments/environment'




@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = 'api/budget/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }


  /** POST: add a new budget to the server */
  addBudget(budget: BudgetPackage): Observable<BudgetPackage> {
    return this.http.post<BudgetPackage>(this.apiUrl, budget, this.httpOptions).pipe(
      tap((newBudget: BudgetPackage) => console.log(`added budget`)),
      catchError(this.handleError<BudgetPackage>('addBudget'))
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

      // TODO: better job of transforming error for user consumption
      //console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
