import { Expense } from "./expense";
import { Income } from "./income";

export interface Receipt {
    receipt_id?: number;
    userid?: number;
    receipt?: {
        receipt_date: string;
        receipt_is_reccuring: boolean;
        receipt_is_income: boolean;
    };
    incomes?: Income[];
    expenses?: Expense[];
    
}