import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { TimeService } from './time.service';
import { IncomeOverTime } from '../models/incomeOverTime';
import { ReceiptTrackService } from '../widget/services/receipt-track.service';
import { Receipt } from '../models/receipt';

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

    if (re.receipt.receipt_is_income)
    {
      
      for (let inc of re.incomes)
      {
        let i = this.catIncByMonth.findIndex(val => val.category_id == inc.category_id && val.year == date.getFullYear()
          && val.month == month)
        if (i >= 0)
        {
          this.catIncByMonth[i].totalIncomeReceived += inc.income_amount;
        }
        else
        {
          this.catIncByMonth.push({category_id: inc.category_id, year: date.getFullYear(), month: month, totalIncomeReceived: inc.income_amount})
        }
      }
      
      let i = this.incByMonth.findIndex(val => val.year == date.getFullYear() && val.month == month)
      if (i >= 0)
      {
        this.incByMonth[i].totalIncomeReceived += total;
      }
      else
      {
        this.incByMonth.push({year: date.getFullYear(), month: month, totalIncomeReceived: total})
      }


      var found = false;
      for (let i in this.cumIncByMonth)
      {
        if ((this.cumIncByMonth[i].year == date.getFullYear() && this.cumIncByMonth[i].month >= month)
          || this.cumIncByMonth[i].year > date.getFullYear())
        {
          found = true;
          this.cumIncByMonth[i].totalIncomeReceived += total;
        }
      }
      if (!found)
      {
        this.cumIncByMonth.push({year: date.getFullYear(), month: month, totalIncomeReceived: total})
      }
      
    }
  
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
            console.log(`Fetched income totals with category breakdown by month`);
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
          console.log(`Fetched cumulative income totals by month`);
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
          console.log(`Fetched income totals by month`);
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
        {console.log(`Fetched current weekly spending total`);
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
