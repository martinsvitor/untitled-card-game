import {GameEngine} from '../game/gameEngine';

export interface JoinResponse {
    isPermitted: boolean;
    message: string;
    gameData?: GameEngine
}