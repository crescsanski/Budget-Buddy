import { Budget } from "./budget";
import { Characteristic } from "./characteristic";

export interface BudgetPackage {
    user_id: number;
    budgets: Budget[];
    characteristics: Characteristic
}