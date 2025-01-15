import {CardItem} from "../types/cardItem.js";
import {Player} from "./playerClass";
import {CardType} from "../types/cardType.js";
import {HighScoreType} from "../types/highScoreType.js";

export class GameEngine {
    private deck: CardItem[] = [];
    private players: Player[] = [];
    private activePlayerId = '';
    readonly maxTurnLength: number;
    private turnTimerId: ReturnType<typeof setTimeout>;
    private partialHighScores: HighScoreType[] = [];
    public cardsOnTable: CardItem[] = [];
    public currentRound: number;

    constructor(private maxPlayers: number, turnLength = 15) {
        this.currentRound = 0;
        this.maxTurnLength = turnLength * 1000;
        this.turnTimerId = setTimeout(() => {
        }, this.maxTurnLength);
    }

    private initDeck() {
        // const cardTypes = Object.keys(CardType) as CardType[];
        const cardTypes = [CardType.Spades, CardType.Hearts];
        const cardValues = [];
        for (let i = 0; i < 15 * cardTypes.length; i++) {
            cardValues.push(i+1);
        }
        for (let i = 0; i < cardValues.length; i++) {
            this.deck.push({type: cardTypes[i%2], value: cardValues[i%15]});
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
            if (player.state === 'played') {
                continue;
            }
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
            this.activePlayerId = player.id;
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

        this.initDeck();
        this.dealCards(6);
        this.cardsOnTable = [];
        this.startRound(currentPlayer);
    }

    public startRound(player: Player) {
        this.currentRound++;

        if (!this.deck.length) {
            if (this.players.some(player => player.state === 'waiting') &&
                !this.players.every(player => player.state === 'waiting')) {
                this.partialHighScores = this.computeHighScores();
                this.players.map(player => player.resetCollectedCards())
                this.initDeck();
                this.dealCards(1);
                this.startRound(player);
                //     call dealCards only for the waiting players
                //     call startAction
            }
            if (this.players.every(player => !player.hand.length)) {
                this.endGame();
                return;
            }
            this.startPlayerAction(player);
            return;
        }

        this.players.forEach((player: Player) => {
            if (this.deck.length) {
                if (player.hand.length < 6) {
                    this.getNewCard(player);
                }
            }
        })

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

    public getNewCard(player: Player) {
        if (!this.deck.length) {
            throw new Error("No more cards on the deck");
        }
        player.hand.push(this.deck.shift()!)
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
        this.partialHighScores = this.computeHighScores();
        if (roundResult.length < 1) {
            throw new Error("No round result");
        }

        if(this.deck.length) {
            const currentPlayer = this.players.find(player => player.id === this.activePlayerId)!;
            currentPlayer.drawCard(this.deck.shift());
        }

        if (roundResult.length == 1) {
            const nextPlayer = this.players.find(player => player.state === 'played')!;
            this.cardsOnTable = [];
            this.players.forEach(player => player.state = 'waiting');
            nextPlayer.state = 'active';
            this.startRound(nextPlayer);
            return;
        }

        roundResult.forEach(player => player.state = 'waiting');
        this.startRound(roundResult[0]);
    }

    private computeHighScores(): HighScoreType[] {
        return (
            this.players.map(player => {
                return {
                    player: Player,
                    points: player.collectedCards.reduce(
                        (acc, card) => acc + card.value, 0)
                }
            })
                .sort(
                    (a, b) =>
                        b.points - a.points));
    }

    public endGame() {
        const finalScores = this.computeHighScores();
        const winnerAnnouncement = `Game Over. ${finalScores[0].player.name} won with ${finalScores[0].points} points`;
        console.log(winnerAnnouncement);
    }

    public getActivePlayerIndex() {
        return this.activePlayerId;
    }

    public getCurrentPlayers() {
        return this.players;
    }

}