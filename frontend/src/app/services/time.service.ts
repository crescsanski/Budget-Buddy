import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WeeklySpendingComponent } from '../widget/weekly-spending/weekly-spending.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private now: Date = new Date()
  private curWeek: number;
  private curMonth: number;
  private curYear: number;
  minDate: Date;
  maxDate: Date;
  minYear: number;
  maxYear: number;

  constructor(private authServ: AuthService) { 
    this.minDate = new Date(this.authServ.currentUserValue.user_registration_date)
    this.minYear = this.minDate.getFullYear()
    this.maxDate = this.now;
    this.maxYear = this.year;
  }

  get week()
  {
    if(this.curWeek == null)
    {
      this.curWeek = this.getWeek(new Date(this.now.getTime()))
    }
    return this.curWeek
  }

  get month()
  {
    if(this.curMonth == null)
    {
      this.curMonth = this.getMonth()
    }
    return this.curMonth;
  }

  get year()
  {
    if(this.curYear == null)
    {
      this.curYear = this.getYear()
    }
    return this.curYear;
  }

  getToday()
  {
    return this.now;
  }

  // Returns the ISO week of the date.
  getWeek(date: Date) {
    //var date = new Date(this.now.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  getDate(w: number, y: number)
  {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  }

  //return number of days in specified month
  getNumDays(year: number, month: number)
  {
    return new Date(year, month, 0).getDate()
  }

  // Returns ISO month of the date
  getMonth()
  {
    return this.now.getMonth() + 1;
  }

  // Returns ISO year of the date
  getYear()
  {
    return this.now.getFullYear();
  }
}
