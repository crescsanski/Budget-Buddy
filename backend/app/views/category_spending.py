class categorySpending :
    @staticmethod
    def main( args) :
        # Test Values
        # Yearly Income (Put total from front end here)
        income = 500000

        # category starts       
        need = 50
        want = 30
        saving = 20

        # user characteristics (Have user select these and update their data upon submition)
        independent = True
        retired = False
        married = True
        multipleIncomes = True
        children = True
        city = True
        pet = False
	# tax refund
        noRefund = True
        
        # categories regular (base values are independent rural)
        housing = 30
        transportation = 16.5
        foodGroceryEssential = 12.5
        medical = 11.5
        utilities = 7.5
        debtPayment = 5
        insurance = 4
        lifestyleEssential = 3
        petCost = 0
        taxPayment = 0
        miscellaneousExpenseEssential = 10
        housing2 = 0.0
        transportation2 = 0.0
        foodGroceryEssential2 = 0.0
        medical2 = 0.0
        utilities2 = 0.0
        debtPayment2 = 0.0
        insurance2 = 0.0
        lifestyleEssential2 = 0.0
        petCost2 = 0.0
        taxPayment2 = 0.0
        miscellaneousExpenseEssential2 = 0.0
        #        //categories retired
        #        housing = 30;
        #        transportation = 9.5;
        #        foodGroceryEssential = 9.5;
        #        medical = 30;
        #        utilities = 7.5;
        #        debtPayment = 2.5;
        #        insurance = 4;
        #        lifestyleEssential = 3;
        #        petCost = 0;
        #        taxPayment = 0;
        #        miscellaneousExpenseEssential = 4;

        #        //categories city
        #        housing = 38.25;
        #        transportation = 8.25;
        #        foodGroceryEssential = 12.5;
        #        medical = 11.5;
        #        utilities = 7.5;
        #        debtPayment = 5;
        #        insurance = 4;
        #        lifestyleEssential = 3;
        #        petCost = 0;
        #        taxPayment = 0;
        #        miscellaneousExpenseEssential = 10;

        #        //categories dependent
        #        housing = 0;
        #        transportation = 16.5;
        #        foodGroceryEssential = 0;
        #        medical = 0;
        #        utilities = 2.5;
        #        debtPayment = 5;
        #        insurance = 0;
        #        lifestyleEssential = 0;
        #        petCost = 0;
        #        taxPayment = 0;
        #        miscellaneousExpenseEssential = 76;

        # Retired
        if (retired) :
            need = 90
            want = 0
            saving = 10
            # category spending
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
            # minor adjustments
            if (city) :
                housing = 38.25
                transportation = 4.75
                miscellaneousExpenseEssential = 0.5
            if (pet) :
                petCost = 0.5
                miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5
            # Retired Married
            if (married) :
                # Retired Married Multiple Incomes
                if (multipleIncomes) :
                    # Retired Married Multiple Incomes City
                    if (city) :
                        need = 95
                        want = 0
                        saving = 5
                else :
                    need = 95
                    want = 0
                    saving = 5
                    # Retired Married One Income No Children City
                    if (city) :
                        need = 100
                        want = 0
                        saving = 0
            else :
                need = 90
                want = 0
                saving = 10
                # Retired Not Married City
                if (city) :
                    need = 95
                    want = 0
                    saving = 5
        else :
            # Indepentent
            if (independent) :
                if (city) :
                    housing = 38.25
                    transportation = 8.25
                if (pet) :
                    petCost = 0.5
                    miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5
                if (noRefund) :
                    taxPayment = 2
                    miscellaneousExpenseEssential = miscellaneousExpenseEssential - 2
                # Independent Married
                if (married) :
                    # Independent Married Multiple Incomes
                    if (multipleIncomes) :
                        # Independent Married Multiple Incomes Children
                        if (children) :
                            need = 65
                            want = 15
                            saving = 20
                            # Independent Married Multiple Incomes Children City
                            if (city) :
                                need = 70
                                want = 10
                                saving = 20
                        else :
                            if (city) :
                                need = 55
                                want = 30
                                saving = 20
                    else :
                        need = 65
                        want = 15
                        saving = 20
                        # Independent Married Single Income Children
                        if (children) :
                            need = 80
                            want = 5
                            saving = 15
                            # Independent Married Single Income Children City
                            if (city) :
                                need = 85
                                want = 5
                                saving = 10
                        else :
                            # Independent Married Single Income City
                            if (city) :
                                need = 70
                                want = 10
                                saving = 20
                else :
                    # Single Children
                    if (children) :
                        need = 65
                        want = 15
                        saving = 20
                        # Single Children City
                        if (city) :
                            need = 70
                            want = 10
                            saving = 20
                    else :
                        # Single City
                        if (city) :
                            need = 55
                            want = 25
                            saving = 20
            else :
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
                # Not Independent City
                if (city) :
                    need = 15
                    want = 30
                    saving = 55
                    transportation = 8.25
                    miscellaneousExpenseEssential = 84.25
                if (pet) :
                    petCost = 0.5
                    miscellaneousExpenseEssential = miscellaneousExpenseEssential - 0.5

        # VALUES THAT ARE REPORTED TO USER
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
        print("BudgetReport")
        #print("")
        #print("Monthly Income: $" + str(income))
        #print("")
        #print("Indepentent: " + str(independent) + " /Retired: " + str(retired) + " /Married: " + str(married) + " /Multiple Incomes: " + str(multipleIncomes) + " /Children: " + str(children) + " /City: " + str(city) + " /Pet: " + str(pet) + " /Tax Payment: " + str(noRefund))
        #print("")
        #print("Needs: " + str((need * 100)) + "%")
        #print("Wants: " + str((want * 100)) + "%")
        #print("Savings: " + str((saving * 100)) + "%")
        #print("")
        #print("Housing Percent: " + str(housing) + "%")
        #print("Transportation Percent: " + str(transportation) + "%")
        #print("Food/Grocery Essential Percent: " + str(foodGroceryEssential) + "%")
        #print("Medical Percent: " + str(medical) + "%")
        #print("Utilities Percent: " + str(utilities) + "%")
        #print("Debt Payment Percent: " + str(debtPayment) + "%")
        #print("Insurance Percent: " + str(insurance) + "%")
        #print("Lifestyle Essential Percent: " + str(lifestyleEssential) + "%")
        #print("Pet Percent: " + str(petCost) + "%")
        #print("Tax Payment Percent: " + str(taxPayment) + "%")
        #print("Miscellaneous Essential Percent: " + str(miscellaneousExpenseEssential) + "%")
        #print("")
        #print("Total Percent: " + str((housing + transportation + foodGroceryEssential + medical + utilities + debtPayment + insurance + lifestyleEssential + petCost + taxPayment + miscellaneousExpenseEssential)) + "%")
        #print("")
        #print("Housing Cost: $" + str(housing2))
        #print("Transportation Cost: $" + str(transportation2))
        #print("Food/Grocery Essential Cost: $" + str(foodGroceryEssential2))
        #print("Medical Cost: $" + str(medical2))
        #print("Utilities Cost: $" + str(utilities2))
        #print("Debt Payment Cost: $" + str(debtPayment2))
        #print("Insurance Cost: $" + str(insurance2))
        #print("Lifestyle Essential Cost: $" + str(lifestyleEssential2))
        #print("Pet Cost: $" + str(petCost2))
        #print("Tax Payment Cost: $" + str(taxPayment2))
        #print("Miscellaneous Essential Cost: $" + str(miscellaneousExpenseEssential2))
        #print("")
    

