export interface Budget {
    budget_id: number;
    projected_income: number;
    projected_expenses: number;
    additional_expenses_goal: number;
    savings_goal: number;
    savings_actual: number;
    expenses_actual: number;
    budget_percent_goal: number;
    start_date: Date;
    user_id: number;
}