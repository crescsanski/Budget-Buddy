export interface Receipt {
    receipt_id?: number;
    receipt_amount: number;
    receipt_date: string;
    reoccuring: string;
    is_income: string;
    user: number;
}