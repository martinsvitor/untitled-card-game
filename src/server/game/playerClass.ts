import {PlayerType} from "../types/playerType.js";
import {CardItem} from "../types/cardItem.js";
import {GameEngine} from "./gameEngine.js";
import {PlayerState} from "../types/playerState.js";
import {ResponseMessage} from '../types/responseMessage';

// TODO: Refactor everything to separate Player and Game classes
export class Player implements PlayerType {
    collectedCards: CardItem[];
    hand: CardItem[];
    playedCard: CardItem | null = null;
    id: string;
    name: string;
    state: PlayerState;
    points: number;

    constructor(id: string, name: string, collectedCards: CardItem[] = [], hand: CardItem[] = []) {
        this.id = id;
        this.name = name;
        this.collectedCards = collectedCards;
        this.hand = hand;
        this.state = 'waiting';
        this.points = 0;
    }

    public drawCard(card: CardItem | undefined): ResponseMessage {
        if (!card) {
            return {
                success: false,
                message: 'No cards in the deck'
            };
        }
        this.hand.push(card);
        return {
            success: true,
            message: 'Got new card'
        };
    }

    public playCard(cardToPlay: CardItem, game: GameEngine): ResponseMessage {
        const cardIndex = this.hand.findIndex(
            (card) => card.type === cardToPlay.type && card.value === cardToPlay.value
        );

        if (cardIndex === -1) {
            return {
                success: false,
                message: 'No cards left in hand'
            };
        }
        this.playedCard = cardToPlay;
        cardToPlay.playedBy = this.id;
        //     Remove the card from player's hand
        this.hand.splice(cardIndex, 1);

        //     Notify the game of played card
        return game.playCard(this, cardToPlay);
    }

    public winRound(cardsWon: CardItem[], points: number) {
        this.collectedCards = cardsWon;
        this.points += points;
    }

    public resetCollectedCards() {
        this.collectedCards.map(card => card.playedBy = '');
        this.collectedCards = [];
    }

    public getPoints() {
        return this.points;
    }

}