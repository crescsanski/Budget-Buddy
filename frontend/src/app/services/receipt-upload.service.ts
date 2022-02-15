import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';
import { SavingsOverTime } from '../models/savingsOverTime';
import { Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root'
})
export class ReceiptUploadService {

  private apiUrl = 'api/receipt_upload/';  // URL to web api

  user: User | null = null;

  get recUplURL()
  {
    return this.apiUrl
  }

  constructor(private http: HttpClient, private auServ: AuthService, private tiServ: TimeService) { 
    this.auServ.currentUser.subscribe(x => this.user = <User>x);


  }

  /**Send a batch of receipts images or PDFs to Django to be converted into digital receipt records.*/
  convertReceiptBatch(files: any[]): Observable<Receipt[]> {
    return this.http.post<any[]>(this.apiUrl, files).pipe(
      tap((convertedReceipts: Receipt[]) => console.log(`Received converted receipts: ${convertedReceipts}.`)),
      catchError(this.handleError<Receipt[]>('convertBatchReceipt'))
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

  
}
