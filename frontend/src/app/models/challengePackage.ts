export interface ChallengePackage {
    challenge: number;
    challenge__challenge_completion_ammount: number;
    challenge__challenge_description: string;
    challenge__challenge_experience_points: number;
    challenge__challenge_id: number;
    challenge__challenge_is_active: boolean;
    challenge__challenge_is_repeatable: boolean;
    challenge__challenge_name: string;
    challenge__challenge_start_ammount: number;
    challenge__challenge_time_given: number;
    challenge__challenge_trigger: number;
    challenge__challenge_type: string;
    challenge__difficulty: number;
    challenge__experience_level_unlock: number;
    challenge__item: number;
    challenge__userchallengeinventory: number;
    user: number;
    user_challenge_completion_date: string;
    user_challenge_current_amount: number;
    user_challenge_inventory_id: number;
    user_challenge_start_date: number;
}