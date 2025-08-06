import { PlayerState } from './playerState.js';

export interface PlayerType {
    id: string;
    name: string;
    hand: number[];
    collectedCards: number[];
    state: PlayerState;
    playedCard?: number;
}
