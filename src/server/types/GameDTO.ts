import {Player} from '../game/playerClass';
import {CardItem} from './cardItem';

export interface GameDTO {
    id: string;
    players: Player[];
    currentRound: number;
    maxPlayers: number;
    numberOfPlayers: number;
    numberOfPlayedCards: number;
    cardsOnTable?: CardItem[];
}