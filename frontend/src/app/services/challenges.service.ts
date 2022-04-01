import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Challenge } from '../models/Challenge';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';


@Injectable({ providedIn: 'root' })
export class ChallengesService {

  private apiUrl = 'api/chall_inv';  // URL to web api
  private challInvs: Challenge[]
  private triggers: Set<string>;
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
  
  get challenges()
  {
    return this.challInvs;
  }

  get trigs()
  {
    return this.triggers;
  }


  /** GET challenges earned by user_id. Will 404 if id not found */
  getChallenges(): Observable<Challenge[]> {
    const url = `${this.apiUrl}/${this.user.user_id}/`;
    return this.http.get<Challenge[]>(url).pipe(
      tap((out: Challenge[]) => 
      {
        this.challInvs = out;
        this.setTriggers(out);
        console.log(`fetched challenges for user`)
      }),
      catchError(this.handleError<Challenge[]>(`getChallenges id=${this.user.user_id}`))
    );
  }

  setTriggers(inv: Challenge[])
  {
    let trig: Set<string> = new Set()
    inv.forEach((val: Challenge) => trig.add(val.trigger))
    this.triggers = trig;
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