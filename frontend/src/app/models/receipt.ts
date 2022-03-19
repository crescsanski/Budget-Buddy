import { Expense } from "./expense";
import { Income } from "./income";

export interface Receipt {
    receipt_id?: number;
    userid?: number;
    quick?: boolean;
    receipt?: {
        receipt_date: string;
        receipt_is_reccuring: number;
        receipt_is_income: boolean;
        receipt_name?: string;
    };
    incomes?: Income[];
    expenses?: Expense[];
    
}