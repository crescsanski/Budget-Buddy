import { newBudgetPrompt } from './../../../models/newBudgetPrompt';
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import {SelectItem} from 'primeng/api';
import { WidgetService } from 'src/app/widget/widget.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { delay, first, flatMap, map, mergeMap } from 'rxjs/operators';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/app/models/budget';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-budget-panel',
  templateUrl: './budget-panel.component.html',
  styleUrls: ['./budget-panel.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(20%)',
      opacity: 0}),
        animate('600ms ease-in', style({transform: 'translateX(0%)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({transform: 'translateX(-20%)', opacity: 0}))
      ])
    ])
  ]
})
export class BudgetPanelComponent implements OnInit {
  
  prompts: newBudgetPrompt[];
  catOptions: Category[];
  form: FormArray
  currentPanel: any;
  exisBudgets: Budget[]
  panelNumber: number = 0;
  visible=true;
  animationDirection: string = "forward";
  totalIncome: number;
  totalExpenses: number;
  availableBudget: number;
  

  constructor(private ws: WidgetService, private fb: FormBuilder,
    private bs: BudgetService,
    private as: AuthService,
    private cs: CategoryService,
    private ms: MessageService) {

      this.cs.getCategories().pipe(
        mergeMap((cats: Category[]) => 
        {
          this.catOptions = cats;
          return this.bs.searchBudgets(this.as.currentUserValue.user_id);
        }),
        map((res: Budget[]) => 
        {
          this.exisBudgets = res;
          this.initializeForm();
        })
      ).subscribe();
    
  this.prompts = [
    //toggle comments to show finalization page first
      //{icon: '../../../../assets/icons/budget-icons/help.png', categoryTitle: 'Finalization', amount: null},
      {icon: 'null', categoryTitle: 'Advisor', amount: null},
      {icon: '../../../../assets/icons/budget-icons/help.png', categoryTitle: 'What\'s Your Budget?', amount: null},
      {icon: '../../../../assets/icons/budget-icons/job-income.png', categoryTitle: 'Job Income',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Received Gift',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/interest.png', categoryTitle: 'Interest',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/gov-payment.png', categoryTitle: 'Government Payment',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/tax-refund.png', categoryTitle: 'Tax Refund',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Income',  amount: 0, type: 'Income'},
      {icon: '../../../../assets/icons/budget-icons/smile.png', categoryTitle: 'Halfway There!', amount: null},
      {icon: '../../../../assets/icons/budget-icons/housing.png', categoryTitle: 'Housing',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/transportation.png', categoryTitle: 'Transportation',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/essential-groceries.png', categoryTitle: 'Essential Groceries',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/non-essential-groceries.png', categoryTitle: 'Non-Essential Groceries',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/utilities.png', categoryTitle: 'Utilities',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/insurance.png', categoryTitle: 'Insurance',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/medical.png', categoryTitle: 'Medical',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/investment.png', categoryTitle: 'Investment',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/restaraunts.png', categoryTitle: 'Restaurants',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/entertainment.png', categoryTitle: 'Entertainment',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Gifts',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/furnishings.png', categoryTitle: 'Furnishings',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/pet.png', categoryTitle: 'Pets',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment', amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense',  amount: 0, type: 'Expense'},
      {icon: '../../../../assets/icons/budget-icons/help.png', categoryTitle: 'Finalization', amount: null},
      {icon: '../../../../assets/icons/budget-icons/thumbs-up.png', categoryTitle: 'All Done!', amount: null},
      {icon: 'null', categoryTitle: 'Advisor', amount: null},
    ]
   }

   initializeForm()
   {
    this.form = this.fb.array([])
    for (let i of this.prompts)
    {
      let cat = this.catOptions.find(val => 
        i.categoryTitle.includes(val.category_name))      
        
        let oR = cat ? this.exisBudgets.find(val => val.category == cat.category_id) : undefined
       
        let foCom = this.fb.group({
          budget_id: [oR ? oR.budget_id : undefined],
          amount: [oR ? oR.estimated_amount : '0', Validators.required]
        })
    
        this.form.push(foCom)
    
    }

   }

  ngOnInit(): void {

    this.currentPanel = this.prompts[this.panelNumber];    
  }

  //simple budget calculations for recommendations:
  sumTotals() {
    this.totalIncome = 0
    this.prompts.forEach(x => {
      if(x.type == 'Income') {
        this.totalIncome += x.amount;
      } else if (x.type == 'Income') {
        this.totalExpenses += x.amount
      }
    });
    this.availableBudget = this.totalIncome - this.totalExpenses;
    return this.availableBudget;
  }

  //shortcut to access all form components
  get f()
  {
    return this.form.controls;
  }

  //shortcut to access one form component
  c(index: number): FormGroup
  {
    return this.f[index] as FormGroup
  }

  pageForward(){
    if(this.panelNumber<(this.prompts.length-1)){
      this.animationDirection = "forward";
      this.visible = false;
      this.panelNumber++
    }
  }

  pageForwardStep2(){
    this.currentPanel = this.prompts[this.panelNumber];
    this.visible = true;
  }

  pageBackward(){
    if(this.panelNumber>0){
      this.animationDirection = "backwards";
      this.visible = false;
    }
    
  }

  pageBackwardStep2(){
    this.panelNumber--;
    this.currentPanel = this.prompts[this.panelNumber];
    this.visible = true;
  }

  slideInOutStart(event) {

  }
  
  slideInOutEnd(event) {
    if (this.animationDirection == 'forward') {
      this.pageForwardStep2();
    } else {
      this.pageBackwardStep2();
    }
  }

  track(x: FormGroup)
  {
    //stop here if the form is invalid
    if (x.invalid)
    {
      this.ms.addInfo("Invalid Entry", "Some fields are incomplete or invalid.")
        return;
    }

    let catID = this.catOptions.find(val => 
      this.currentPanel.categoryTitle.includes(val.category_name)).category_id

    let budget: Budget = {
      budget_id: x.get('budget_id').value,
      user: this.as.currentUserValue.user_id,
      category: catID,
      estimated_amount: x.get('amount').value,
      last_modified_date: new Date().toISOString()
    }
    if(x.get('budget_id').value == undefined)
    {
      this.bs.addBudget(budget)
      .pipe(first())
      .subscribe({
          next: (res: Budget) => {
              if (res && res.budget_id)
              {
                this.ms.addSuccess('Budget Successfully Record', "");
                x.get('budget_id').setValue(res.budget_id)
                this.pageForward();
              }
              else
              {
                this.ms.addError(`Error in Recording Budget`, "");
              }
          },
          error: error => {
              for (const key in error)
              {
                this.ms.addError(`Error in Recording Budget: ${key}`, error[key]);
              }
          }
      });
    }
    else
    {
      this.bs.updateBudget(budget)
      .pipe(first())
      .subscribe({
          next: () => {
              this.ms.addSuccess('Budget Successfully Updated', "");
              this.pageForward();
          },
          error: error => {
              for (const key in error)
              {
                this.ms.addError(`Error in Updating Budget: ${key}`, error[key]);
              }
          }
      });
    }
    
}
 

}
