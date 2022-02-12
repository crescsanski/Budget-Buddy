import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Receipt } from '../models/receipt';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class ReceiptService {

  private receiptsUrl = 'api/receipts/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET receipts from the server */
  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.receiptsUrl)
      .pipe(
        tap(_ => console.log('fetched receipts')),
        catchError(this.handleError<Receipt[]>('getReceipts', []))
      );
  }

  /** GET receipt by id. Return `undefined` when id not found */
  getReceiptNo404<Data>(id: number): Observable<Receipt> {
    const url = `${this.receiptsUrl}/?id=${id}`;
    return this.http.get<Receipt[]>(url)
      .pipe(
        map(receipts => receipts[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`${outcome} receipt id=${id}`);
        }),
        catchError(this.handleError<Receipt>(`getReceipt id=${id}`))
      );
  }

  /** GET receipt by id. Will 404 if id not found */
  getReceipt(id: number): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.get<Receipt>(url).pipe(
      tap(_ => console.log(`fetched receipt id=${id}`)),
      catchError(this.handleError<Receipt>(`getReceipt id=${id}`))
    );
  }

  /* GET receipts whose name contains search term */
  searchReceipts(term: string): Observable<Receipt[]> {
    if (!term.trim()) {
      // if not search term, return empty receipt array.
      return of([]);
    }
    return this.http.get<Receipt[]>(`${this.receiptsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         console.log(`found receipts matching "${term}"`) :
         console.log(`no receipts matching "${term}"`)),
      catchError(this.handleError<Receipt[]>('searchReceipts', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new receipt to the server */
  addReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.receiptsUrl, receipt, this.httpOptions).pipe(
      tap((newReceipt: Receipt) => console.log(`added receipt w/ id=${newReceipt.receipt_id}`)),
      catchError(this.handleError<Receipt>('addReceipt'))
    );
  }

  /** DELETE: delete the receipt from the server */
  deleteReceipt(id: number): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${id}`;

    return this.http.delete<Receipt>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted receipt id=${id}`)),
      catchError(this.handleError<Receipt>('deleteReceipt'))
    );
  }

  /** PUT: update the receipt on the server */
  updateReceipt(receipt: Receipt): Observable<any> {
    return this.http.put(this.receiptsUrl, receipt, this.httpOptions).pipe(
      tap(_ => console.log(`updated receipt id=${receipt.receipt_id}`)),
      catchError(this.handleError<any>('updateReceipt'))
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

      // TODO: better job of transforming error for receipt consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ReceiptService message with the MessageService */
  private log(message: string) {
    this.messageService.addInfo(`ReceiptService: ${message}`, "");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/