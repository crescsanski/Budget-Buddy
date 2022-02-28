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
export class BudgetScoreService {

  private budgetsUrl = 'api/budget_score/';  // URL to web api
  user: User | null = null;
  private budgetScore: number;
  private budgetGrade: string;

  get rawScore()
  {
    return this.budgetScore;
  }

  get letterGrade()
  {
    return this.budgetGrade;
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

  /** GET budget score from the server */
  getBudgetScore(): Observable<number> {
    let url = `${this.budgetsUrl}${this.user.user_id}/`
    return this.http.get<number>(url)
      .pipe(
        tap((score: number) => {this.setScore(score); console.log('fetched budget score')}),
        catchError(this.handleError<number>('getBudgetScore'))
      );
  }

  setScore(score: number)
  {
    this.budgetScore = score;
    if (this.budgetScore < 60)
    {
      this.budgetGrade = "F"
    }
    else if (this.budgetScore < 62)
    {
      this.budgetGrade = "D-"
    }
    else if (this.budgetScore < 68)
    {
      this.budgetGrade = "D"
    }
    else if (this.budgetScore < 70)
    {
      this.budgetGrade = "D+"
    }
    else if (this.budgetScore < 72)
    {
      this.budgetGrade = "C-"
    }
    else if (this.budgetScore < 78)
    {
      this.budgetGrade = "C"
    }
    else if (this.budgetScore < 80)
    {
      this.budgetGrade = "C+"
    }
    else if (this.budgetScore < 82)
    {
      this.budgetGrade = "B-"
    }
    else if (this.budgetScore < 88)
    {
      this.budgetGrade = "B"
    }
    else if (this.budgetScore < 90)
    {
      this.budgetGrade = "B+"
    }
    else if (this.budgetScore < 92)
    {
      this.budgetGrade = "A-"
    }
    else if (this.budgetScore < 98)
    {
      this.budgetGrade = "A"
    }
    else
    {
      this.budgetGrade = "A+"
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