import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpendingOverTime } from '../models/spendingOverTime'
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
  private cumUrl = 'api/cum_spend_history';
  user: User | null = null;
  private weeklySpendingTotal: number;
  private cumSpenByMonth: SpendingOverTime[];
  private spenByMonth: SpendingOverTime[];

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

  get cumSpendingsByMonth()
  {
    return this.cumSpenByMonth;
  }

  get spendByMonth()
  {
    return this.spenByMonth;
  }

  /**GET cumulative spending growth by month.*/
  getByMonthCumSpendings(): Observable<SpendingOverTime[]>
  {
    const url = `${this.cumUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<SpendingOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched cumulative spending totals by month = ${out}`);
          this.cumSpenByMonth = out;
        }
      
        ),
      catchError(this.handleError<SpendingOverTime[]>(`getSpendingsHistory`))
    );
  }

  /**GET spending by month.*/
  getByMonthSpendings(): Observable<SpendingOverTime[]>
  {
    const url = `${this.apiUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<SpendingOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched spending totals by month = ${out}`);
          this.spenByMonth = out;
        }
      
        ),
      catchError(this.handleError<SpendingOverTime[]>(`getSpendingsHistory`))
    );
  }

  /** GET total spending for current week */
  getCurWeekSpend(): Observable<SpendingOverTime[]> {

    const url = `${this.apiUrl}/${this.user.user_id}/?year=${this.tiServ.year}&month=${this.tiServ.month}&week=${this.tiServ.week}`
    console.log(url)

    return this.http.get<SpendingOverTime[]>(url).pipe(
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
      catchError(this.handleError<SpendingOverTime[]>(`getSpendOverTimeForCurrentWeek`))
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
