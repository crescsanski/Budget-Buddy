export interface BasicManualSpend 
{
    receipt_date: Date,
    product_price: number;
    product_name: string;
    category: number;
    reocurring?: number;
}