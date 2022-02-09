import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpendHistory } from '../models/spendHistory'
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class SpendingHistoryService {

  private apiUrl = 'api/spend_history';  // URL to web api
  user: User | null = null;
  private weeklySpendingTotal: number;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private auServ: AuthService, private tiServ: TimeService) { 
    this.auServ.currentUser.subscribe(x => this.user = <User>x);


  }

  

  get weekSpend()
  {
    return this.weeklySpendingTotal;
  }

  set weekSpend(value)
  {
    this.weeklySpendingTotal = value;
  }

  /** GET total spending for current week */
  getCurWeekSpend(): Observable<SpendHistory[]> {

    const url = `${this.apiUrl}/${this.user.user_id}/?year=${this.tiServ.year}&month=${this.tiServ.month}&week=${this.tiServ.week}`
    console.log(url)

    return this.http.get<SpendHistory[]>(url).pipe(
      tap(out => 
        {console.log(`Fetched current weekly spending total = ${out}`);
        if (out.length > 0)
        {
          this.weeklySpendingTotal = out[0].totalSpent;
        }
        else
        {
          this.weeklySpendingTotal = 0;
        }   
      
        }),
      catchError(this.handleError<SpendHistory[]>(`getSpendHistoryForCurrentWeek`))
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
