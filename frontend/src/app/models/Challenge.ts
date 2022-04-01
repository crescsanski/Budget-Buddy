export interface Challenge {
    id: number;
    name: string;
    label?: string;
    fracCompl: number;
    description: string;
    start_date: string;
    end_date: string;
    goal: number;
    progress: number;
    completion_date: string;
    type: string;
    time_given: number;
    trigger: string;
}