import { Challenge } from "./Challenge"
import { LevelProgress } from "./LevelProgress"

export interface ChallengeInventoryPackage {
    inventory: Challenge[],
    levelProgress: LevelProgress
}
