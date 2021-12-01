export interface BasicManualIncome
{
    receipt_date: Date,
    income_amount: number;
    reocurring?: number;
    income_name: string;
    category: number;
}