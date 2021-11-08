export interface Receipt {
    receipt_id: number;
    receipt_amount: number;
    receipt_date: Date;
    reoccuring: boolean;
    is_income: boolean;
    user_id: number;
}