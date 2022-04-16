import { Budget } from "./budget";

export interface BudgetPackage {
    user_id: number;
    budgets: Budget[];
    characteristics: {
        user_independent: boolean;
        user_retired: boolean;
        user_married: boolean;
        user_multiple_incomes: boolean;
        user_children: boolean;
        user_city: boolean;
        user_pet: boolean;
        user_gets_tax_refund: boolean;
    }
}