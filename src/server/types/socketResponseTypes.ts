import { GameDTO } from './GameDTO';

export interface CustomResponse {
    success: boolean;
    message: string;
    gameData?: GameDTO,
}