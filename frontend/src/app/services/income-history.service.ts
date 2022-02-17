import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';
import { IncomeOverTime } from '../models/incomeOverTime';

@Injectable({
  providedIn: 'root'
})
export class IncomeHistoryService {

  private apiUrl = 'api/income_history';  // URL to web api
  private cumUrl = 'api/cum_income_history';
  user: User | null = null;
  private weeklyIncomeTotal: number;
  private cumIncByMonth: IncomeOverTime[]
  private incByMonth: IncomeOverTime[]
  private catIncByMonth: IncomeOverTime[]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private auServ: AuthService, private tiServ: TimeService) { 
    this.auServ.currentUser.subscribe(x => this.user = <User>x);


  }

  get weekIncome()
  {
    return this.weeklyIncomeTotal;
  }

  get cumIncomeByMonth()
  {
    return this.cumIncByMonth;
  }

  get incomeByMonth()
  {
    return this.incByMonth;
  }

  get catIncomeByMonth()
  {
    return this.catIncByMonth;
  }

    /**GET income by category within each month */
    getIncomeCatBreakdown(): Observable<IncomeOverTime[]>
    {
      const url = `${this.apiUrl}/${this.user.user_id}/?period=monthly&category_breakdown=true`
  
      return this.http.get<IncomeOverTime[]>(url).pipe(
        tap(out => 
          {
            console.log(`Fetched income totals with category breakdown by month = ${out}`);
            this.catIncByMonth = out;
          }
        
          ),
        catchError(this.handleError<IncomeOverTime[]>(`getIncomeHistory`))
      );
    }

  /**GET cumulative income growth by month.*/
  getByMonthCumIncome(): Observable<IncomeOverTime[]>
  {
    const url = `${this.cumUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<IncomeOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched cumulative income totals by month = ${out}`);
          this.cumIncByMonth = out;
        }
      
        ),
      catchError(this.handleError<IncomeOverTime[]>(`getIncomeHistoryByMonth`))
    );
  }

  /**GET income received by month.*/
  getByMonthIncome(): Observable<IncomeOverTime[]>
  {
    const url = `${this.apiUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<IncomeOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched income totals by month = ${out}`);
          this.incByMonth = out;
        }
      
        ),
      catchError(this.handleError<IncomeOverTime[]>(`getIncomeHistoryByMonth`))
    );
  }

  /** GET total income received for current week */
  getCurWeeklyIncome(): Observable<IncomeOverTime[]> {

    const url = `${this.apiUrl}/${this.user.user_id}/?year=${this.tiServ.year}&month=${this.tiServ.month}&week=${this.tiServ.week}`
    console.log(url)

    return this.http.get<IncomeOverTime[]>(url).pipe(
      tap(out => 
        {console.log(`Fetched current weekly spending total = ${out}`);
        if (out.length > 0)
        {
          this.weeklyIncomeTotal = out[0].totalIncomeReceived;
        }
        else
        {
          this.weeklyIncomeTotal = 0;
        }   
      
        }),
      catchError(this.handleError<IncomeOverTime[]>(`getIncomeHistoryForCurrentWeek`))
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
