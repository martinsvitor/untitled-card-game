import { CardItem } from '../types/cardItem.js';
import { Player } from './playerClass';
import { CardType } from '../types/cardType.js';
import { HighScoreType } from '../types/highScoreType.js';

export class GameEngine {
    private deck: CardItem[] = [];
    private players: Player[] = [];
    private activePlayerId = '';
    readonly maxTurnLength: number;
    private partialHighScores: HighScoreType[] = [];
    public id: string;
    public cardsOnTable: CardItem[] = [];
    public currentRound: number;
    public cardsLeft: number;
    public gameWinner: string = '';
    public maxPlayers: number;
    public numberOfPlayers = 0;

    constructor(maxPlayers = 4, turnLength = 15) {
        this.id = Date.now().toString(36);
        this.currentRound = 0;
        this.maxTurnLength = turnLength * 1000;
        this.cardsLeft = 56;
        this.maxPlayers = maxPlayers;
    }

    private initDeck() {
        const cardTypes = Object.keys(CardType) as CardType[];
        const cardValues: number[] = [];
        for (let i = 0; i < 14 * cardTypes.length; i++) {
            cardValues.push(i + 1);
        }
        for (let i = 0; i < cardTypes.length; i++) {
            let modifier = 0;
            switch (cardTypes[i]) {
                case CardType.Clubs:
                    modifier = 0.4;
                    break;
                case CardType.Spades:
                    modifier = 0.3;
                    break;
                case CardType.Hearts:
                    modifier = 0.2;
                    break;
                case CardType.Diamonds:
                    modifier = 0.1;
                    break;
                default:
                    throw new Error(`Invalid deck type: ${cardTypes[i]}`);
            }
            for (let j = 0; j < cardValues.length / 4; j++) {
                const singleCardValue = cardValues[j % 14] + modifier;
                this.deck.push({ type: cardTypes[i], value: singleCardValue });
            }
        }

        this.cardsLeft = this.deck.length;
        this.shuffleDeck();
    }

    private shuffleDeck() {
        this.deck.sort(() => Math.random() - 0.5);
    }

    private dealCards(cardsPerPlayer: number) {
        if (this.deck.length < cardsPerPlayer * this.players.length) {
            throw new Error('Not enough cards in the deck');
        }
        for (const player of this.players) {
            if (player.state === 'played') {
                continue;
            }
            player.hand = this.deck.splice(0, cardsPerPlayer);
            this.cardsLeft -= cardsPerPlayer;
        }
    }

    public addPlayer(player: Player) {
        if (this.players.length >= this.maxPlayers) {
            throw new Error('Maximum number of players reached');
        }
        const isDuplicatePlayer = this.players.some(
            (existingPlayer) => existingPlayer.id === player.id
        );
        if (isDuplicatePlayer) {
            return;
        }
        this.players.push(player);
        this.numberOfPlayers++;
        if (this.players.find((player) => player.state === 'active')) {
            player.state = 'waiting';
        } else {
            player.state = 'active';
            this.activePlayerId = player.id;
        }
    }

    public startGame() {
        if (this.currentRound !== 0) {
            throw new Error('Game is already underway');
        }

        if (this.players.length <= 1) {
            throw new Error('Not enough players to start the game');
        }

        const currentPlayer = this.players.find(
            (player) => player.id === this.activePlayerId
        );
        if (!currentPlayer) {
            throw new Error('No players to start the game');
        }

        this.initDeck();
        this.dealCards(6);
        this.cardsOnTable = [];
        this.startRound(currentPlayer);
    }

    public startRound(player: Player) {
        this.currentRound++;

        if (this.deck.length === 0) {
            if (this.players.every((player) => player.hand.length === 0)) {
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
        });

        if (player.state !== 'active') {
            throw new Error("This is not this players' action");
        }
        this.startPlayerAction(player);
    }

    private startPlayerAction(player: Player) {
        this.activePlayerId = player.id;
    }

    public getNewCard(player: Player) {
        if (!this.deck.length) {
            throw new Error('No more cards on the deck');
        }
        player.hand.push(this.deck.shift()!);
        this.cardsLeft--;
    }

    public playCard(player: Player, cardPlayed: CardItem) {
        if (this.activePlayerId !== player.id) {
            throw new Error("This is not this players' action");
        }
        console.log(
            `${player.name} played ${cardPlayed.value} of ${cardPlayed.type}`
        );

        this.cardsOnTable.push(cardPlayed);
        this.endPlayerAction(player);
    }

    private endPlayerAction(currentPlayer: Player) {
        currentPlayer.state = 'played';
        const waitingPlayers = this.players.filter(
            (player) => player.state === 'waiting'
        );

        if (waitingPlayers.length <= 0) {
            this.finishRound();
        } else {
            waitingPlayers[0].state = 'active';
            this.startPlayerAction(waitingPlayers[0]);
        }
    }

    private computeRoundWinner(): Player[] {
        const highestCardValue = Math.max(
            ...this.cardsOnTable.map((card) => card.value)
        );
        const winningCard = this.cardsOnTable.filter(
            (card) => card.value == highestCardValue
        );

        const winners = winningCard.map(
            (card) =>
                this.players.find((player) => player.id === card.playedBy)!
        );
        if (winningCard.length > 1) {
            // Clubs > Spades > Hearts > Diamonds
            console.warn('Should never be arrived');
            return winners.map((winner) => winner);
        }
        const pointsInTheRound = this.cardsOnTable.reduce(
            (acc, currentValue) => acc + Math.trunc(currentValue.value),
            0
        );
        winners[0].winRound(this.cardsOnTable, pointsInTheRound);
        return winners;
    }

    public finishRound() {
        const roundResult = this.computeRoundWinner();
        this.partialHighScores = this.computeHighScores();
        if (roundResult.length < 1) {
            throw new Error('No round result');
        }

        if (this.deck.length) {
            const currentPlayer = this.players.find(
                (player) => player.id === this.activePlayerId
            )!;
            currentPlayer.drawCard(this.deck.shift());
        }
        const nextPlayer = this.players.find(
            (player) => player.state === 'played'
        )!;
        this.cardsOnTable = [];
        this.players.forEach((player) => (player.state = 'waiting'));
        nextPlayer.state = 'active';
        this.startRound(nextPlayer);
        return;
    }

    private computeHighScores(): HighScoreType[] {
        return this.players
            .map((player) => {
                return {
                    player: Player,
                    points: player.getPoints(),
                };
            })
            .sort((a, b) => b.points - a.points);
    }

    public endGame() {
        const finalScores = this.computeHighScores();
        const winnerAnnouncement = `Game Over. ${finalScores[0].player.name} won with ${finalScores[0].points} points`;
        this.gameWinner = finalScores[0].player.name;
        console.log(winnerAnnouncement);
    }

    public getActivePlayerIndex() {
        return this.activePlayerId;
    }

    public getCurrentPlayers() {
        return this.players;
    }
}
