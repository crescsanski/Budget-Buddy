import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-budget-algorithm',
  templateUrl: './budget-algorithm.component.html',
  styleUrls: ['./budget-algorithm.component.scss']
})
export class BudgetAlgorithmComponent implements OnInit {

  userAttributes: SelectItem<boolean>[];
  load: boolean = false;
  answers: SelectItem<boolean>[];
  income: number;

  @Output() pageForward  = new EventEmitter();

  @Input() monthlyIncome: number;

  nextPage(pack: any) {
    this.pageForward.emit(pack);
  }

  
  constructor() { 

    this.answers = [{label: "Yes", value: true}, {label: "No", value: false}]
    this.userAttributes = [
      {label: "Are you independent?", value: undefined},
      {label: "Are you retired?", value: undefined},
      {label: "Are you married?", value: undefined},
      {label: "Do you have multiple incomes?", value: undefined},
      {label: "Do you have children?", value: undefined},
      {label: "Do you live in a city?", value: undefined},
      {label: "Do you own a pet?", value: undefined},
      {label: "Do you receive a tax refund?", value: undefined}
    ]
  }

  ngOnInit(): void {
    this.income = this.monthlyIncome * 12
  }

  runSpendingRec()
  {
    // Test Values
    // Yearly Income (Put total from front end here)
    let income = this.income

    // category starts       
    let need = 50
    let want = 30
    let saving = 20

    // user characteristics (Have user select these and update their data upon submition)
    let independent = this.userAttributes[0].value
    let retired = this.userAttributes[1].value
    let married = this.userAttributes[2].value
    let multipleIncomes = this.userAttributes[3].value
    let children = this.userAttributes[4].value
    let city = this.userAttributes[5].value
    let pet = this.userAttributes[6].value
// tax refund
    let noRefund = this.userAttributes[7].value
    
    // categories regular (base values are independent rural)
    let housing = 30
    let transportation = 16.5
    let foodGroceryEssential = 12.5
    let medical = 11.5
    let utilities = 7.5
    let debtPayment = 5
    let insurance = 4
    let lifestyleEssential = 3
    let petCost = 0
    let taxPayment = 0
    let miscellaneousExpenseEssential = 10
    let housing2 = 0.0
    let transportation2 = 0.0
    let foodGroceryEssential2 = 0.0
    let medical2 = 0.0
    let utilities2 = 0.0
    let debtPayment2 = 0.0
    let insurance2 = 0.0
    let lifestyleEssential2 = 0.0
    let petCost2 = 0.0
    let taxPayment2 = 0.0
    let miscellaneousExpenseEssential2 = 0.0
    //        //categories retired
    //        housing = 30;
    //        transportation = 9.5;
    //        foodGroceryEssential = 9.5;
    //        medical = 30;
    //        utilities = 7.5;
    //        debtPayment = 2.5;
    //        insurance = 4;
    //        lifestyleEssential = 3;
    //        petCost = 0;
    //        taxPayment = 0;
    //        miscellaneousExpenseEssential = 4;

    //        //categories city
    //        housing = 38.25;
    //        transportation = 8.25;
    //        foodGroceryEssential = 12.5;
    //        medical = 11.5;
    //        utilities = 7.5;
    //        debtPayment = 5;
    //        insurance = 4;
    //        lifestyleEssential = 3;
    //        petCost = 0;
    //        taxPayment = 0;
    //        miscellaneousExpenseEssential = 10;

    //        //categories dependent
    //        housing = 0;
    //        transportation = 16.5;
    //        foodGroceryEssential = 0;
    //        medical = 0;
    //        utilities = 2.5;
    //        debtPayment = 5;
    //        insurance = 0;
    //        lifestyleEssential = 0;
    //        petCost = 0;
    //        taxPayment = 0;
    //        miscellaneousExpenseEssential = 76;

    // Retired
    if (retired) {
        need = 90
        want = 0
        saving = 10
        // category spending
        housing = 30
        transportation = 9.5
        foodGroceryEssential = 9.5
        medical = 30
        utilities = 7.5
        debtPayment = 2.5
        insurance = 4
        lifestyleEssential = 3
        petCost = 0
        taxPayment = 0
        miscellaneousExpenseEssential = 4
        // minor adjustments
        if (city){
            housing = 38.25
            transportation = 4.75
            miscellaneousExpenseEssential = 0.5
        }
        if (pet){
            petCost = 0.5
            miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5
        }
        // Retired Married
        if (married){
            // Retired Married Multiple Incomes
            if (multipleIncomes){
                // Retired Married Multiple Incomes City
                if (city){
                    need = 95
                    want = 0
                    saving = 5
                }
            }
            else {
                need = 95
                want = 0
                saving = 5
                // Retired Married One Income No Children City
                if (city){
                    need = 100
                    want = 0
                    saving = 0
                }
        else{
            need = 90
            want = 0
            saving = 10
            // Retired Not Married City
            if (city){
                need = 95
                want = 0
                saving = 5
            }
          }
        }
      }
    }
    else{
        // Indepentent
        if (independent){
            if (city){
                housing = 38.25
                transportation = 8.25
            }
            if (pet){
                petCost = 0.5
                miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5
            }
            if (noRefund){
                taxPayment = 2
                miscellaneousExpenseEssential = miscellaneousExpenseEssential - 2
            }
            // Independent Married
            if (married){
                // Independent Married Multiple Incomes
                if (multipleIncomes){
                    // Independent Married Multiple Incomes Children
                    if (children){
                        need = 65
                        want = 15
                        saving = 20
                        // Independent Married Multiple Incomes Children City
                        if (city){
                            need = 70
                            want = 10
                            saving = 20
                        }
                    else{
                        if (city){
                            need = 55
                            want = 30
                            saving = 20
                        }
                    }
                  }
                }
                else{
                    need = 65
                    want = 15
                    saving = 20
                    // Independent Married Single Income Children
                    if (children){
                        need = 80
                        want = 5
                        saving = 15
                        // Independent Married Single Income Children City
                        if (city){
                            need = 85
                            want = 5
                            saving = 10
                        }
                    }
                    else{
                        // Independent Married Single Income City
                        if (city){
                            need = 70
                            want = 10
                            saving = 20
                        }
                    }
                  }
                }
            else{
                // Single Children
                if (children){
                    need = 65
                    want = 15
                    saving = 20
                
                    // Single Children City
                    if (city){
                        need = 70
                        want = 10
                        saving = 20
                    }
                else{
                    // Single City
                    if (city){
                        need = 55
                        want = 25
                        saving = 20
                      }
                    }     
                }       
        else{
            need = 10
            want = 30
            saving = 60
            housing = 0
            transportation = 16.5
            foodGroceryEssential = 0
            medical = 0
            utilities = 2.5
            debtPayment = 5
            insurance = 0
            lifestyleEssential = 0
            petCost = 0
            taxPayment = 0
            miscellaneousExpenseEssential = 76
        
            // Not Independent City
            if (city){
                need = 15
                want = 30
                saving = 55
                transportation = 8.25
                miscellaneousExpenseEssential = 84.25
            }
            if (pet){
                petCost = 0.5
                miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5
            }
        }
      }
    }
  }

    // VALUES THAT ARE REPORTED TO USER
    want = want * 0.01
    need = need * 0.01
    saving = saving * 0.01
    income = income / 12
    housing2 = income * need * (housing * 0.01)
    transportation2 = income * need * (transportation * 0.01)
    foodGroceryEssential2 = income * need * (foodGroceryEssential * 0.01)
    medical2 = income * need * (medical * 0.01)
    utilities2 = income * need * (utilities * 0.01)
    debtPayment2 = income * need * (debtPayment * 0.01)
    insurance2 = income * need * (insurance * 0.01)
    lifestyleEssential2 = income * need * (lifestyleEssential * 0.01)
    petCost2 = income * need * (petCost * 0.01)
    taxPayment2 = income * need * (taxPayment * 0.01)
    miscellaneousExpenseEssential2 = income * need * (miscellaneousExpenseEssential * 0.01)

    this.nextPage({
        want: want,
        need: need,
        saving: saving,
        income: income,
        "Housing": {amount: housing2,
                  percen: housing * 0.01,
                  cat: "Housing"},
        "Transportation": {amount: transportation2, percen: transportation * 0.01, cat: "Transportation"},
        "Food/Grocery Essential": {amount: foodGroceryEssential2, percen: foodGroceryEssential * 0.01, cat: "Food/Grocery Essential"},
        "Medical": {amount: medical2, percen: medical * 0.01, cat: "Medical"},
        "Utilities": {amount: utilities2, percen: utilities * 0.01, cat: "Utilities"},
        "Debt Payment": {amount: debtPayment2, percen: debtPayment * 0.01, cat: "Debt Payment"},
        "Insurance": {amount: insurance2, percen: insurance * 0.01, cat: "Insurance"},
        "Lifestyle Essential": {amount: lifestyleEssential2, percen: lifestyleEssential * 0.01, cat: "Lifestyle Essential"},
        "Pet": {amount: petCost2, percen: petCost * 0.01, cat: "Pet"},
        "Tax Payment": {amount: taxPayment2, percen: taxPayment * 0.01, cat: "Tax Payment"},
        "Miscellaneous Expense Essential": {amount: miscellaneousExpenseEssential2, percen: miscellaneousExpenseEssential * 0.01, cat: "Miscellaneous Expense Essential"}
    })

    /*
    console.log("BudgetReport")
    console.log("")
    console.log("Monthly Income: $" + income)
    console.log("")
    console.log("Indepentent: " + independent + " /Retired: " + retired + " /Married: " + married + " /Multiple Incomes: " + multipleIncomes + " /Children: " + children + " /City: " + city + " /Pet: " + pet + " /Tax Payment: " + noRefund)
    console.log("")
    console.log("Needs: " + (need * 100) + "%")
    console.log("Wants: " + (want * 100) + "%")
    console.log("Savings: " + (saving * 100) + "%")
    console.log("")
    console.log("Housing Percent: " + housing + "%")
    console.log("Transportation Percent: " + transportation + "%")
    console.log("Food/Grocery Essential Percent: " + foodGroceryEssential + "%")
    console.log("Medical Percent: " + medical + "%")
    console.log("Utilities Percent: " + utilities + "%")
    console.log("Debt Payment Percent: " + debtPayment + "%")
    console.log("Insurance Percent: " + insurance + "%")
    console.log("Lifestyle Essential Percent: " + lifestyleEssential + "%")
    console.log("Pet Percent: " + petCost + "%")
    console.log("Tax Payment Percent: " + taxPayment + "%")
    console.log("Miscellaneous Essential Percent: " + miscellaneousExpenseEssential + "%")
    console.log("")
    console.log("Total Percent: " + (housing + transportation + foodGroceryEssential + medical + utilities + debtPayment + insurance + lifestyleEssential + petCost + taxPayment + miscellaneousExpenseEssential) + "%")
    console.log("")
    console.log("Housing Cost: $" + housing2)
    console.log("Transportation Cost: $" + transportation2)
    console.log("Food/Grocery Essential Cost: $" + foodGroceryEssential2)
    console.log("Medical Cost: $" + medical2)
    console.log("Utilities Cost: $" + utilities2)
    console.log("Debt Payment Cost: $" + debtPayment2)
    console.log("Insurance Cost: $" + insurance2)
    console.log("Lifestyle Essential Cost: $" + lifestyleEssential2)
    console.log("Pet Cost: $" + petCost2)
    console.log("Tax Payment Cost: $" + taxPayment2)
    console.log("Miscellaneous Essential Cost: $" + miscellaneousExpenseEssential2)
    console.log("")
    */
  }

}
