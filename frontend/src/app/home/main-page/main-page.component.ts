import { BudgetCategory } from './../../models/formModels/budgetCategory';
import { Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { MessageService } from 'src/app/services/message.service';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { BudgetService } from 'src/app/services/budget.service';
import { TimeService } from 'src/app/services/time.service';
import { Budget } from 'src/app/models/budget';
import { TriggerService } from 'src/app/services/trigger.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  pageLabel: String = '';
  currentPage: String = '';
  settings: MenuItem[] = [];
  loading: boolean = false;
  dashboardWidgets: any[] | undefined;
  budgetWidgets: any[] | undefined;
  trackingWidgets: any[] | undefined;
  analyticsWidgets: any[] | undefined;
  rewardsWidgets: any[] | undefined;
  roomWidgets: any[] | undefined;
  hidden: boolean = true;
  name: string = undefined;
  level: number = undefined;
  favoriteMenu: boolean = false;
  budgetCategories: Category[];
  selectedCategories: Category[];
  welcomeMessage: boolean = false; 
  avatarEditor: boolean = false;
  trackingType: string = "income";



  constructor(private authService: AuthService, private trigServ: TriggerService, private ts: TimeService, private budServ: BudgetService, private catServ: CategoryService, private messageService: MessageService, private router: Router) { 
    
    try{
      this.router.getCurrentNavigation().extras.state.newUser;
      this.welcomeMessage = true;
      }
    catch(e) {}
    

    //this.currentPage = 'Dashboard';
    this.currentPage = 'Tracking';
   if (authService.currentUserValue)
    {
      this.name = authService.currentUserValue.user_first_name + " " + authService.currentUserValue.user_last_name;
      this.level = authService.currentUserValue.user_level;
    }   

    this.budgetCategories = this.catServ.expenseCats.concat(this.catServ.incomeCats)
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
      
    ]

    this.trackingWidgets = [
     //retrieve list of tracking widgets
    ]

    this.analyticsWidgets = [
     
    ]

    this.rewardsWidgets = [
    ]
    this.roomWidgets = [
      
    ]

    let fetch = this.budServ.exBudByCat.concat(this.budServ.inBudByCat).filter(val => val.year == this.ts.year && 
      val.month == this.ts.month && val.is_favorite == true)
      //console.log(fetch)
    this.selectedCategories = this.budgetCategories.filter((val) => 
    {
        return fetch.find(val2 => val.category_id == val2.category_id)
    }
    
    )
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
    //First, we'll wipe the user's current budgets.
    this.budServ.resetBudget().subscribe((out: string) => {
      if (out != "error")
      {
        this.router.navigateByUrl('/new-budget')
      }
    })
    
  }

  showFavorites(){
    this.favoriteMenu = true;
  }

  setFavorites(){
    //TODO: API TO SET FAVORITES
    this.loading = true;
    var post: Budget[] = []
    this.budgetCategories.forEach((val) => {
      if (this.selectedCategories.find(val2 => val2.category_id == val.category_id))
      {
        post.push({
          user_category_budget_favorite: true,
          category: val.category_id,
        });
      }
      else
      {
        post.push({
          user_category_budget_favorite: false,
          category: val.category_id,
        })
      }
    })
   
    this.budServ.updateBudget(post).subscribe(() => {
      this.favoriteMenu = false;
      this.loading = false;
      this.trigServ.announceFavoritesChange(this.selectedCategories)
    })
  }

  openAvatarEditor(){
    this.avatarEditor = true;
  }


}
