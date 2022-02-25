import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BadgesEarned } from '../models/badgesEarned';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';


@Injectable({ providedIn: 'root' })
export class BadgesEarnedService {

  private badgesEarnedUrl = 'api/badges_earned';  // URL to web api
  private badgesEarned: BadgesEarned[]
  user: User | null = null;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService) { 
      this.authService.currentUser.subscribe(x => this.user = <User>x);
    }
  
  get earnedBadges()
  {
    return this.badgesEarned;
  }


  /** GET badges earned by user_id. Will 404 if id not found */
  getBadgesEarned(): Observable<BadgesEarned[]> {
    const url = `${this.badgesEarnedUrl}/${this.user.user_id}/`;
    return this.http.get<BadgesEarned[]>(url).pipe(
      tap((out: BadgesEarned[]) => 
      {
        this.badgesEarned = out;
        console.log(`fetched badges for user`)
      }),
      catchError(this.handleError<BadgesEarned[]>(`getBadgesEarned id=${this.user.user_id}`))
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
      console.log(`${operation} failed: ${error.message}`);

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