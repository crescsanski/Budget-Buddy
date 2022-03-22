import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';
import { SavingsOverTime } from '../models/savingsOverTime';
import { ReceiptTrackService } from '../widget/services/receipt-track.service';
import { Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root'
})
export class SavingsHistoryService {

  private apiUrl = 'api/savings_history';  // URL to web api
  private cumUrl = 'api/cum_savings_history';
  user: User | null = null;
  private weeklySavingsTotal: number;
  private cumSavByMonth: SavingsOverTime[]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private rs: ReceiptTrackService, private auServ: AuthService, private tiServ: TimeService) { 
    this.auServ.currentUser.subscribe(x => this.user = <User>x);


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
            re.receipt.receipt_is_income ? this.weeklySavingsTotal += total : this.weeklySavingsTotal -= total;
          }    
        }
        
        
        for (let i in this.cumSavByMonth)
        {
          if ((this.cumSavByMonth[i].year == date.getFullYear() && this.cumSavByMonth[i].month >= month)
            || this.cumSavByMonth[i].year > date.getFullYear())
          {
            re.receipt.receipt_is_income ? this.cumSavByMonth[i].totalSavings += total : this.cumSavByMonth[i].totalSavings -= total;
          }
        }
        
      }
    }

  get weekSavings()
  {
    return this.weeklySavingsTotal;
  }

  get cumSavingsByMonth()
  {
    return this.cumSavByMonth;
  }

  /**GET cumulative savings growth by month.*/
  getByMonthCumSavings(): Observable<SavingsOverTime[]>
  {
    const url = `${this.cumUrl}/${this.user.user_id}/?period=monthly`

    return this.http.get<SavingsOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched cumulative savings totals by month`);
          this.cumSavByMonth = out;
        }
      
        ),
      catchError(this.handleError<SavingsOverTime[]>(`getSavingsHistoryForCurrentWeek`))
    );
  }

  /** GET total savings received for current week */
  getCurWeeklySavings(): Observable<SavingsOverTime[]> {

    const url = `${this.apiUrl}/${this.user.user_id}/?year=${this.tiServ.year}&month=${this.tiServ.month}&week=${this.tiServ.week}`

    return this.http.get<SavingsOverTime[]>(url).pipe(
      tap(out => 
        {console.log(`Fetched current weekly spending total`);
        if (out.length > 0)
        {
          this.weeklySavingsTotal = out[0].totalSavings;
        }
        else
        {
          this.weeklySavingsTotal = 0;
        }   
      
        }),
      catchError(this.handleError<SavingsOverTime[]>(`getSavingsHistoryForCurrentWeek`))
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
