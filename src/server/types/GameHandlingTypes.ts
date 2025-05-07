import {GameEngine} from '../game/gameEngine';

export interface GameError {
    success: boolean,
    message: string;
}

export type GameSearchResult = GameEngine | GameError;