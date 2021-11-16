export interface Receipt {
    receipt_id?: number;
    receipt_amount: number;
    receipt_date: Date;
    reoccuring: string;
    is_income: string;
    user: number;
}