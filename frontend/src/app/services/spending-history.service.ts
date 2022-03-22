import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpendingOverTime } from '../models/spendingOverTime'
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';
import { QuickReceipt } from '../models/simReceipt';
import { Receipt } from '../models/receipt';
import { ReceiptTrackService } from '../widget/services/receipt-track.service';

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
  private catSpendByMonth: SpendingOverTime[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, 
    private rs: ReceiptTrackService,
    private auServ: AuthService, private tiServ: TimeService) { 
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

  get catSpenByMonth()
  {
    return this.catSpendByMonth;
  }

  //Update amounts given new receipt
  updateValues(re: Receipt, mode: string)
  {
    let date = new Date(re.receipt.receipt_date)
    let month = date.getMonth() + 1
    let total = this.rs.getTotal(re)
    switch (mode)
    {
      case "delete":
        total = -1 * total;
        break;
      case "update":
        total = total - re.preTotal
        break;
    }

    if (!re.receipt.receipt_is_income)
    {
      if (date.getFullYear() == this.tiServ.year && month == this.tiServ.month)
      {
        if (this.tiServ.getWeek(date) == this.tiServ.week)
        {
          this.weeklySpendingTotal += total;
        }    
      }
      
      for (let i in this.catSpenByMonth) 
      {
       
        if (this.catSpenByMonth[i].year == date.getFullYear() && this.catSpenByMonth[i].month == month)
        {
          for (let exp of re.expenses)
          {
            if (this.catSpenByMonth[i].category_id == exp.category_id)
            {
              this.catSpenByMonth[i].totalSpent += exp.expense_price;
            }
          }
        }
        
      }
      
      for (let i in this.spenByMonth) 
      {
        if (this.spenByMonth[i].year == date.getFullYear() && this.spenByMonth[i].month == month)
        {
          this.spenByMonth[i].totalSpent += total;
          break;
        }
      }
      for (let i in this.cumSpenByMonth)
      {
        if ((this.cumSpenByMonth[i].year == date.getFullYear() && this.cumSpenByMonth[i].month >= month)
          || this.cumSpenByMonth[i].year > date.getFullYear())
        {
          this.cumSpenByMonth[i].totalSpent += total;
        }
      }
      
    }
    
    

  }

  /**GET spending by category within each month */
  getSpendCatBreakdown(): Observable<SpendingOverTime[]>
  {
    const url = `${this.apiUrl}/${this.user.user_id}/?period=monthly&category_breakdown=true`

    return this.http.get<SpendingOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched spending totals with category breakdown by month`);
          this.catSpendByMonth = out;
        }
      
        ),
      catchError(this.handleError<SpendingOverTime[]>(`getSpendingsHistory`))
    );
  }

  /**GET cumulative spending growth by month.*/
  getByMonthCumSpendings(): Observable<SpendingOverTime[]>
  {
    const url = `${this.cumUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<SpendingOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched cumulative spending totals by month`);
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
          console.log(`Fetched spending totals by month`);
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
        {console.log(`Fetched current weekly spending total`);
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
