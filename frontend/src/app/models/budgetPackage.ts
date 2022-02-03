import { Budget } from "./budget";

export interface BudgetPackage {
    user_id: number;
    budgets: Budget[];
}