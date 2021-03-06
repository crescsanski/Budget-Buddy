export interface Challenge {
    id: number;
    challenge_id: number;
    name: string;
    label?: string;
    badge_name: string;
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
    displayGoal?: string;
    displayProg?: string;
    displayLabel?: string;
}