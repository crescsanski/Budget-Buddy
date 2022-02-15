import { Expense } from "./expense";
import { Income } from "./income";

export interface QuickReceipt {
    receipt_id?: number;
    user_id?: number;
    category: number;
    receipt_name: string;
    receipt_amount: number;
    receipt_date: string;
    reccuring: boolean;
    is_income: boolean;   
}