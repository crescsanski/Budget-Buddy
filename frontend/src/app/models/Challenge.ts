export interface Challenge {
    id: number;
    name: string;
    label?: string;
    fracCompl: number;
    description: string;
    rewardPoints: number;
    no_badge: boolean; //if there is no badge earned for completing the challenge
    is_active: boolean;
    start_date: string;
    end_date: string;
    goal: number;
    progress: number;
    completion_date: string;
    type: string;
    time_given: number;
    trigger: string;
}