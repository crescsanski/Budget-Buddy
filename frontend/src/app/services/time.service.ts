import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  now: Date = new Date()
  curWeek: number;
  curMonth: number;
  curYear: number;

  constructor() { }

  get week()
  {
    if(this.curWeek == null)
    {
      this.curWeek = this.getWeek()
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

  // Returns the ISO week of the date.
  getWeek() {
    var date = new Date(this.now.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
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
