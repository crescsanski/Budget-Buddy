export interface Receipt {
    receipt_id?: number;
    receipt_amount: number;
    receipt_date: string;
    reccuring: number;
    is_income: boolean;
    user: number;
}