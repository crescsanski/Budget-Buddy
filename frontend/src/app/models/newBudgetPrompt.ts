export interface newBudgetPrompt {
    icon?: string;
    categoryTitle: string;
    info?: string; //can be used to get category info
    amount: number; //amount value per item
    type?: string; //income or expense
    break?: number;
    target?: number;
    id?: number;
    category?: string; //want, need, debt repayment
}