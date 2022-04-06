import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WeeklySpendingComponent } from '../widget/weekly-spending/weekly-spending.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  DEFAULT_COLORS = ['#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
'#3366CC', '#316395', '#994499', '#109618', '#990099',
'#22AA99', '#AAAA11', '#6633CC','#DC3912', '#FF9900',
'#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

  constructor(private authServ: AuthService) { 
    
  }

  configureDefaultColors(data: number[]): string[] {
    let customColours = []
     if (data.length) {
     customColours = data.map((element, idx) => {
        return this.DEFAULT_COLORS[idx % this.DEFAULT_COLORS.length];
      });
     }
    return customColours;
    }

  
}
