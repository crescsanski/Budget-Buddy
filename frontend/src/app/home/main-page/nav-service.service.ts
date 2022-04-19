import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  page: any;
  getPage$: Observable<any>;
  private getPageSubject = new Subject<any>();
  pageChange: Subject<string> = new Subject<string>();
  constructor() { 
    this.getPage$ = this.getPageSubject.asObservable();
  }

  getPage(data: any){
    this.page = data;
    this.pageChange.next(this.page);
    
  }
}
