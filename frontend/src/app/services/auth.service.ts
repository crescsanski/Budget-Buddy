import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private authUrl = 'api/auth/';  // URL to web api
  private logoutUrl = 'api/auth/logout/'
  private registerUrl = 'api/auth/register/';
  private userUrl = 'api/users/';
  private user: User | null = null;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    private messageService: MessageService) { 
      //allows other components to easily get the current value of the logged in user without have to subscribe to the currentUser observable
      this.currentUserSubject = new BehaviorSubject<User | null>(this.user);
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
          this.user = user;
          this.log(`logged in successfully w/ token=${user.token}`);
          this.currentUserSubject.next(user);
          return user;
          }
        )
    );
  }

  /** LOGOUT user */
  logout()
  {
    // request that the user's token be deleted from the database
    return this.http.post<User>(this.logoutUrl, {}, this.httpOptions).pipe(
      map((x) => {
           // store user details and login token in local storage to keep user logged in
          // remove user from local storage and set current user to null
          this.user = null
          this.currentUserSubject.next(null);

          //return to login page
          this.router.navigate(['login-page']);
          return x;
          }
         )
     );
  }
 

  /** REGISTER new user */
  register(user: User)
  {
    return this.http.post(this.registerUrl, user, this.httpOptions);
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
          this.user = user;

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
    this.messageService.addInfo(`AuthService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/