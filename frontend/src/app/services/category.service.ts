import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Category } from '../models/category';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class CategoryService {

  
  private categoriesUrl = 'api/category/';  // URL to web api
  
  private incomeCategories: BehaviorSubject<Category[] | null>;
  private expenseCategories: BehaviorSubject<Category[] | null>;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
      this.incomeCategories = new BehaviorSubject<Category[] | null>(null);
      this.expenseCategories = new BehaviorSubject<Category[] | null>(null);
    }
  
  public get incomeCats(): Category[] | null {
    return this.incomeCategories.value;
  }

  public get expenseCats(): Category[] | null {
    return this.expenseCategories.value;
  }

   /** GET income categories from the server */
   getIncomeCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoriesUrl}?category_is_income=true/`)
      .pipe(
        tap((incCats: Category[]) => {
          console.log('fetched income categories');
          this.incomeCategories.next(incCats);
        }),
        catchError(this.handleError<Category[]>('getCategories', []))
      );
  }

     /** GET spending categories from the server */
     getSpendingCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.categoriesUrl}?category_is_income=false/`)
        .pipe(
          tap((spenCats: Category[]) => {
            console.log('fetched spending categories');
            this.expenseCategories.next(spenCats);
          }),
          catchError(this.handleError<Category[]>('getCategories', []))
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

      // TODO: better job of transforming error for category consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CategoryService message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`CategoryService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/