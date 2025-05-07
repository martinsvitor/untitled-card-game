import {GameEngine} from '../game/gameEngine';
import {ResponseMessage} from './responseMessage';
import {GameDTO} from './GameDTO';

export interface JoinResponse {
    isPermitted: boolean;
    message: string;
    gameData?: GameEngine
}

export interface ActionResponse {
    response:  ResponseMessage,
    gameData?: GameDTO,
}