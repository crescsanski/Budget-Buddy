import { Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { MessageService } from 'src/app/services/message.service';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  pageLabel: String = '';
  currentPage: String = '';
  settings: MenuItem[] = [];
  dashboardWidgets: any[] | undefined;
  budgetWidgets: any[] | undefined;
  trackingWidgets: any[] | undefined;
  analyticsWidgets: any[] | undefined;
  rewardsWidgets: any[] | undefined;
  roomWidgets: any[] | undefined;
  hidden: boolean = true;
  name: string = undefined;
  level: number = undefined;



  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { 
   this.currentPage = 'Dashboard';
   //this.currentPage = 'Tracking';
  }

  ngOnInit(): void {
    this.settings = [
      { label: 'New', icon: 'pi pi-fw pi-plus'},
      { label: 'Open', icon: 'pi pi-fw pi-download'},
      { label: 'Undo', icon: 'pi pi-fw pi-refresh'}
  ];

  //obtain list of widgets via http request
    this.dashboardWidgets = [
     //retrieve list of dashboard widgets
    ]

    this.budgetWidgets = [
      { size: 'large', title: 'Breakdown', image: '../../assets/prototype-images/bar-graph.png' },
      { size: 'large', title: 'Net Income', image: '../../assets/prototype-images/pie-chart.png', button: 'Add Income' },
      { size: 'small', title: 'Weekly Budget Manager', image: '../../assets/prototype-images/budget-breakdown.png' },
      { size: 'small', title: 'Income', image: '../../assets/prototype-images/income-breakdown.png' }
    ]

    this.trackingWidgets = [
     //retrieve list of tracking widgets
    ]

    this.analyticsWidgets = [
      { size: 'large', title: 'Savings', image: '../../assets/prototype-images/line-graph.png' },
      { size: 'large', title: 'Total Spending', image: '../../assets/prototype-images/spending-progress-bar.png' },
      { size: 'large', title: 'Net Income', image: '../../assets/prototype-images/pie-chart.png' },
      { size: 'small', title: 'Report Card', image: '../../assets/prototype-images/report-card.png' },
      { size: 'small', title: 'Top 3: Spending', image: '../../assets/prototype-images/top-3-spending.png' }
    ]

    this.rewardsWidgets = [
      { size: 'large', title: 'Trophies', image: '../../assets/prototype-images/rewards-panel.png' },
      { size: 'large', title: 'Progress', image: '../../assets/prototype-images/badges-progress.png' },
      { size: 'small', title: 'Badges', image: '../../assets/prototype-images/line-graph.png' },
    ]

    this.roomWidgets = [
      { size: 'large', title: '', image: '../../assets/prototype-images/room.png' },
      
    ]
    
  }

  onNotify(page:string) {
    this.currentPage = page;
  }

  toggleHidden() {
    this.hidden = !this.hidden;
  }

  cleanLogout() {
    this.authService.cleanLogout().pipe(first())
    .subscribe({
        next: () => {
            this.messageService.addSuccess('Logout successful', "");
        },
        error: error => {
            for (const key in error)
            {
              this.messageService.addError(`Logout error: ${key}`, error[key]);
            }
        }
    });
  }

  goToNewBudget(){
    this.router.navigate(['/new-budget'])
  }



}
