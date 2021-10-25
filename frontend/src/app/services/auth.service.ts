import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { MessageService } from './message.service';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private authUrl = 'api-token-auth';  // URL to web api
  private userUrl = 'user';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService) { 
      //allows other components to easily get the current value of the logged in user without have to subscribe to the currentUser observable
      this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') as string));
      //exposes user as an observable, so any component can be notified when a user logs in, logs out, or updates their profile
      this.currentUser = this.currentUserSubject.asObservable();
    }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /** LOGIN user */
  login(username: string, password: string) {
    return this.http.post<User>(this.authUrl, {username, password}, this.httpOptions).pipe(
     map((user) => {
          // store user details and login token in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(user))
          this.log(`logged in successfully w/ token=${user}`);
          this.currentUserSubject.next(user);
          return user;
          }
        ),
      catchError(this.handleError<User>('loginUser'))
    );
  }

  /** LOGOUT user */
  logout()
  {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    //return to login page
    this.router.navigate(['login']);
  }

  /** REGISTER new user */
  register(user: User)
  {
    return this.http.post(this.userUrl, user);
  }

  /** UPDATE user information */
  update(id: any, params: any)
  {
    return this.http.put(`${this.userUrl}/${id}`, params)
      .pipe(map(x => {
        //update stored user if the logged in user updated their own record
        if (id == this.currentUserValue?.user_id)
        {
          // update local storage
          const user = {...this.currentUserValue, ...params};
          localStorage.setItem('currentUser', JSON.stringify(user));

          //publish updated user to subscribers
          this.currentUserSubject.next(user);
        }
        return x;
      }))
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

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/