import { Player } from '../game/playerClass';

export interface GameDTO {
    id: string;
    players: Player[];
    currentRound: number;
    maxPlayers: number;
    numberOfPlayers: number;
    numberOfPlayedCards: number;
    cardsOnTable?: number[];
}
