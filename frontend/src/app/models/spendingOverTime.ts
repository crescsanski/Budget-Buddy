export interface SpendingOverTime {
    year?: number;
    month?: number;
    week?: number;
    category_id?: number;
    category__category_type?: string;
    totalSpent: number;
}