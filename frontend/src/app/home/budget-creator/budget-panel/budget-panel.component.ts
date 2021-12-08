import { newBudgetPrompt } from './../../../models/newBudgetPrompt';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { MessageService } from 'src/app/services/message.service';
import {SelectItem} from 'primeng/api';
import { WidgetService } from 'src/app/widget/widget.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { delay } from 'rxjs/operators';

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
  currentPanel: any;
  panelNumber: number = 0;
  frequencyOptions!: SelectItem[];
  visible=true;
  animationDirection: string = "forward";
  

  constructor(private ws: WidgetService) {
    
    this.prompts = [
      {icon: '../../../../assets/icons/budget-icons/help.png', categoryTitle: 'What\'s Your Budget?'},
      {icon: '../../../../assets/icons/budget-icons/job-income.png', categoryTitle: 'Job Income'},
      {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Received Gift'},
      {icon: '../../../../assets/icons/budget-icons/interest.png', categoryTitle: 'Interest'},
      {icon: '../../../../assets/icons/budget-icons/gov-payment.png', categoryTitle: 'Government Payment'},
      {icon: '../../../../assets/icons/budget-icons/tax-refund.png', categoryTitle: 'Tax Refund'},
      {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Income'},
      {icon: '../../../../assets/icons/budget-icons/smile.png', categoryTitle: 'Halfway There!'},
      {icon: '../../../../assets/icons/budget-icons/housing.png', categoryTitle: 'Housing'},
      {icon: '../../../../assets/icons/budget-icons/transportation.png', categoryTitle: 'Transportation'},
      {icon: '../../../../assets/icons/budget-icons/essential-groceries.png', categoryTitle: 'Essential Groceries'},
      {icon: '../../../../assets/icons/budget-icons/non-essential-groceries.png', categoryTitle: 'Non-Essential Groceries'},
      {icon: '../../../../assets/icons/budget-icons/utilities.png', categoryTitle: 'Utilities'},
      {icon: '../../../../assets/icons/budget-icons/insurance.png', categoryTitle: 'Insurance'},
      {icon: '../../../../assets/icons/budget-icons/medical.png', categoryTitle: 'Medical'},
      {icon: '../../../../assets/icons/budget-icons/investment.png', categoryTitle: 'Investment'},
      {icon: '../../../../assets/icons/budget-icons/restraunts.png', categoryTitle: 'Restaraunts'},
      {icon: '../../../../assets/icons/budget-icons/entertainment.png', categoryTitle: 'Entertainment'},
      {icon: '../../../../assets/icons/budget-icons/clothing.png', categoryTitle: 'Clothing'},
      {icon: '../../../../assets/icons/budget-icons/gift.png', categoryTitle: 'Gifts'},
      {icon: '../../../../assets/icons/budget-icons/furnishings.png', categoryTitle: 'Furnishings'},
      {icon: '../../../../assets/icons/budget-icons/pet.png', categoryTitle: 'Pets'},
      {icon: '../../../../assets/icons/budget-icons/tax-payment.png', categoryTitle: 'Tax Payment'},
      {icon: '../../../../assets/icons/budget-icons/misc-income.png', categoryTitle: 'Miscellaneous Expense'},
      {icon: '../../../../assets/icons/budget-icons/thumbs-up.png', categoryTitle: 'All Done!'},
    ]

    this.frequencyOptions = this.ws.frequencyOptions;
   }

  ngOnInit(): void {

    this.currentPanel = this.prompts[this.panelNumber];

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

 

}
