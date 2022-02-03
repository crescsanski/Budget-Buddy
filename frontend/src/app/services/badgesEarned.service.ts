import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BadgesEarned } from '../models/badgesEarned';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class BadgesEarnedService {

  private badgesEarnedUrl = 'api/badges_earned';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** GET badges earned by user_id. Will 404 if id not found */
  getBadgesEarned(user_id: number): Observable<BadgesEarned[]> {
    const url = `${this.badgesEarnedUrl}/${user_id}/`;
    return this.http.get<BadgesEarned[]>(url).pipe(
      tap(_ => console.log(`fetched badges for user=${user_id}`)),
      catchError(this.handleError<BadgesEarned[]>(`getBadgesEarned id=${user_id}`))
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
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a badgesEarnedervice message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`badgesEarnedervice: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/