import { PlayerType } from '../types/playerType.js';
import { GameEngine } from './gameEngine.js';
import { PlayerState } from '../types/playerState.js';
import { CustomResponse } from '../types/socketResponseTypes';

// TODO: Refactor everything to separate Player and Game classes
export class Player implements PlayerType {
    collectedCards: number[];
    hand: number[];
    playedCard: number | null = null;
    id: string;
    name: string;
    state: PlayerState;
    points: number;

    constructor(
        id: string,
        name: string,
        collectedCards: number[] = [],
        hand: number[] = []
    ) {
        this.id = id;
        this.name = name;
        this.collectedCards = collectedCards;
        this.hand = hand;
        this.state = 'waiting';
        this.points = 0;
    }

    public drawCard(card: number | undefined): CustomResponse {
        if (!card) {
            return {
                success: false,
                message: 'No cards in the deck',
            };
        }
        this.hand.push(card);
        return {
            success: true,
            message: 'Got new card',
        };
    }

    public playCard(cardToPlay: number, game: GameEngine): CustomResponse {
        const cardIndex = this.hand.findIndex((card) => card === cardToPlay);

        if (cardIndex === -1) {
            return {
                success: false,
                message: 'No cards left in hand',
            };
        }
        this.playedCard = cardToPlay;
        //     Remove the card from player's hand
        this.hand.splice(cardIndex, 1);

        this.setPlayerStatus('played');

        //     Notify the game of played card
        return game.playCard(this, cardToPlay);
    }

    public setPlayerStatus(state: PlayerState): CustomResponse {
        this.state = state;
        return {
            success: true,
            message: `Player status: ${state}`,
        };
    }

    public winRound(cardsWon: number[]) {
        this.collectedCards.push(...cardsWon);
    }

    public resetCollectedCards() {
        this.collectedCards = [];
    }

    public getPoints() {
        return this.points;
    }
}
