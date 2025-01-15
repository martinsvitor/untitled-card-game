import {PlayerType} from "../types/playerType.js";
import {CardItem} from "../types/cardItem.js";
import {GameEngine} from "./gameEngine.js";
import {PlayerState} from "../types/playerState.js";

export class Player implements PlayerType {
    collectedCards: CardItem[];
    hand: CardItem[];
    id: string;
    name: string;
    state: PlayerState;

    constructor(id: string, name: string, collectedCards: CardItem[] = [], hand: CardItem[] = []) {
        this.id = id;
        this.name = name;
        this.collectedCards = collectedCards;
        this.hand = hand;
        this.state = 'waiting';
    }

    public drawCard(card: CardItem) {
        this.hand.push(card);
    }

    public playCard(cardToPlay: CardItem, game: GameEngine) {
        const cardIndex = this.hand.findIndex(
            (card) => card.type === cardToPlay.type && card.value === cardToPlay.value
        );

        if (cardIndex === -1) {
            throw new Error('Card not found in hand');
        }

        cardToPlay.playedBy = this.id;
        //     Remove the card from player's hand
        this.hand.splice(cardIndex, 1);

        //     Notify the game of played card
        game.playCard(this, cardToPlay);
    }

    public winRound(cardsWon: CardItem[]) {
        this.collectedCards = cardsWon;
    }

    public resetCollectedCards() {
        this.collectedCards = [];
    }

}