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
  private cumSav: SavingsOverTime[]

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
      let week = this.tiServ.getWeek(date)
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
  
     
      
        if (date.getFullYear() == this.tiServ.year && month == this.tiServ.month)
        {
          if (this.tiServ.getWeek(date) == this.tiServ.week)
          {
            re.receipt.receipt_is_income ? this.weeklySavingsTotal += total : this.weeklySavingsTotal -= total;
          }    
        }
        
        var found = false;
        for (let i in this.cumSav)
        {
          let itDate = this.tiServ.getDate(this.cumSav[i].week, this.cumSav[i].year)
          let comDate = this.tiServ.getDate(this.tiServ.getWeek(date), date.getFullYear())

          if (itDate >= comDate)
          {
            found = true;
            re.receipt.receipt_is_income ? this.cumSav[i].totalSavings += total : this.cumSav[i].totalSavings -= total;
          }
        }
        if (!found)
        {
          if (re.receipt.receipt_is_income)
          {
            this.cumSav.push({year: date.getFullYear(), month: month, week: week, totalSavings: total});
          }
          else
          {
            this.cumSav.push({year: date.getFullYear(), month: month, week: week, totalSavings: -1 * total});
          }
        }
        
      
    }

  get weekSavings()
  {
    return this.weeklySavingsTotal;
  }

  get cumSavings()
  {
    return this.cumSav;
  }

  /**GET cumulative savings growth.*/
  getCumSavings(): Observable<SavingsOverTime[]>
  {
    const url = `${this.cumUrl}/${this.user.user_id}/?period=weekly`

    return this.http.get<SavingsOverTime[]>(url).pipe(
      tap(out => 
        {
          console.log(`Fetched cumulative savings totals by week`);
          this.cumSav = out;
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
