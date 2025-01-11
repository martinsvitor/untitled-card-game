import {CardItem} from "../types/cardItem.js";
import {Player} from "./PlayerClass.js";
import {CardType} from "../types/cardType.js";

export class GameEngine {
    private deck: CardItem[] = [];
    private players: Player[] = [];
    private activePlayerId = '';
    readonly maxTurnLength: number;
    private turnTimerId: ReturnType<typeof setTimeout>;
    public cardsOnTable: CardItem[] = [];
    public currentRound: number;

    constructor(private maxPlayers: number, turnLength = 15) {
        this.activePlayerId = this.players[0].id;
        this.currentRound = 0;
        this.maxTurnLength = turnLength * 1000;
        this.turnTimerId = setTimeout(() => {
        }, this.maxTurnLength);
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

    private dealCards(cardsPerPlayer: number) {
        if (this.deck.length < cardsPerPlayer * this.players.length) {
            throw new Error("Not enough cards in the deck");
        }
        for (const player of this.players) {
            player.hand = this.deck.splice(0, cardsPerPlayer);
        }
    }

    public addPlayer(player: Player) {
        if (this.players.length >= this.maxPlayers) {
            throw new Error("Maximum number of players reached");
        }
        this.players.push(player);
        if (this.players.find((player) => player.state === 'active')) {
            player.state = 'waiting';
        } else {
            player.state = 'active';
        }

    }

    public startGame() {
        if (this.currentRound !== 0) {
            throw new Error("Game is already underway");
        }

        if (this.players.length <= 1) {
            throw new Error("Not enough players to start the game");
        }

        const currentPlayer = this.players.find(player => player.id === this.activePlayerId);
        if (!currentPlayer) {
            throw new Error("No players to start the game");
        }

        this.currentRound++;
        this.dealCards(6);
        this.cardsOnTable = [];
        this.startRound(currentPlayer);
    }

    public startRound(player: Player) {
        this.currentRound++;
        if (player.state !== 'active') {
            throw new Error("This is not this players' action");
        }
        this.startPlayerAction(player);
    }

    private startPlayerAction(player: Player) {
        this.activePlayerId = player.id;
        this.turnTimerId = setTimeout(() => {
            this.endPlayerAction(player, true)
            return;
        }, 15000);
    }

    public playCard(player: Player, cardPlayed: CardItem) {
        if (this.activePlayerId !== player.id) {
            throw new Error("This is not this players' action");
        }
        console.log(`${player.name} played ${cardPlayed.value} of ${cardPlayed.type}`);

        this.cardsOnTable.push(cardPlayed);
        this.endPlayerAction(player);
    }

    private endPlayerAction(currentPlayer: Player, timeout = false) {
        if (!timeout) {
            clearTimeout(this.turnTimerId);
        }

        currentPlayer.state = 'played';
        const waitingPlayers = this.players.filter(player => player.state === 'waiting');

        if (waitingPlayers.length <= 0) {
            this.finishRound();
        }

        waitingPlayers[0].state = 'active';
        this.startPlayerAction(waitingPlayers[0]);
    }

    private computeRoundWinner(): Player[] {
        const highestCardValue = Math.max(...this.cardsOnTable.map(card => card.value));
        const winningCard = this.cardsOnTable.filter(card => card.value == highestCardValue);

        const winners = winningCard.map(
            card => this.players.find(player => player.id === card.playedBy)!
        );
        if (winningCard.length > 1) {

            console.log(`It's a Tie! ${winners.map(player => player.name).join(', ')} will play another round. There can only be one!`);

            return winners
        }
        winners[0].winRound(this.cardsOnTable);
        return winners;

    }

    public finishRound() {
        const roundResult = this.computeRoundWinner();
        if (roundResult.length < 1) {
            throw new Error("No round result");
        }
        if (roundResult.length == 1) {
            const nextPlayer = this.players.find(player => player.state === 'played')!;
            this.cardsOnTable = [];
            this.players.forEach(player => player.state = 'waiting');
            nextPlayer.state = 'active';
            this.startRound(nextPlayer);
            return;
        } else {
            roundResult.forEach(player => player.state = 'waiting');
            this.startRound(roundResult[0]);

        }
    }

    private computeFinalScores(): { name: string; id: string; finalScore: number }[] {
        return (
            this.players.map(player => {
                return {
                    name: player.name,
                    id: player.id,
                    finalScore: player.collectedCards.reduce(
                        (acc, card) => acc + card.value, 0)
                }
            })
                .sort(
                    (a, b) =>
                        b.finalScore - a.finalScore));
    }

    public endGame() {
        const finalScores = this.computeFinalScores();
    }

    public getActivePlayerIndex() {
        return this.activePlayerId;
    }

}