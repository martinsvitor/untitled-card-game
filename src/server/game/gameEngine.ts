import {CardItem} from "../types/cardItem.js";
import {PlayerType} from "../types/playerType.js";
import {CardType} from "../types/cardType.js";

export class GameEngine {
    private deck: CardItem[] = [];
    private players: PlayerType[] = [];
    private inactivePlayersId: string[] = [];
    private activePlayerId: string = '';
    private actionsPerRound = this.players.length;
    public cardsOnTable: CardItem[] = [];
    public currentRound: number;

    constructor(private maxPlayers: number) {
        this.activePlayerId = this.players[0].id;
        this.currentRound = 0;
        this.initDeck();
    }

    private initDeck() {
        // const cardTypes = Object.keys(CardType) as CardType[];
        const cardTypes = [CardType.Spades, CardType.Hearts];
        const cardValues = Array(10).fill(undefined).map((_, index) => index + 1);
        for (const type of cardTypes) {
            for (const value of cardValues) {
                this.deck = [{type, value}];
            }
        }

        this.shuffleDeck();
    }

    private shuffleDeck() {
        this.deck.sort(() => Math.random() - 0.5);
    }

    public addPlayer(player: PlayerType) {
        if (this.players.length >= this.maxPlayers) {
            throw new Error("Maximum number of players reached");
        }
        this.players.push(player);
        if (this.activePlayerId !== player.id) {
            this.inactivePlayersId.push(player.id);
        }
    }

    public startGame() {
        if (this.currentRound !== 0) {
            throw new Error("Game is already underway");
        }

        this.currentRound++;
        this.dealCards(6);
        this.startRound();
    }

    private dealCards(cardsPerPlayer: number) {
        if (this.deck.length < cardsPerPlayer * this.players.length) {
            throw new Error("Not enough cards in the deck");
        }
        for (const player of this.players) {
            player.hand = this.deck.splice(0, cardsPerPlayer);
        }
    }

    public startRound() {
        this.cardsOnTable = [];
        const lastPlayer = this.activePlayerId;
        this.activePlayerId = this.inactivePlayersId.splice(0, 1).toString();
        this.inactivePlayersId.push(lastPlayer);

    }

    public playerAction(player: PlayerType) {
        this.activePlayerId = this.inactivePlayersId.splice(0, 1).toString();
        this.inactivePlayersId.push(player.id);
    }

    private finishRound() {

    }

    public getCurrentPlayerIndex() {
        // return this.players[this.currentPlayerIndex];
    }

    public playCard(player: PlayerType, cardPlayed: CardItem) {
        console.log(`${player.name} played ${cardPlayed.value} of ${cardPlayed.type}`);
        this.cardsOnTable.push(cardPlayed);
        this.activePlayerId = this.players.filter(nextPlayer => nextPlayer.id !== player.id)[0].id;
    }

}