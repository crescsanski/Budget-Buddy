export interface Budget {
    year?: number, 
    month?: number, 
    categoryTitle?: string, 
    category_id?: number, 
    category?: number,
    category_type?: string, 
    altered_amount?: number, 
    estimated_amount?: number, 
    is_favorite?: boolean,
    user_category_budget_favorite?: boolean,
    max?: number,
    new_amount?: number,
    visible?: boolean
}