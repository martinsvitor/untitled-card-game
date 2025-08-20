import { Player } from './playerClass';
import { HighScoreType } from '../types/highScoreType.js';
import { GameDTO } from '../types/GameDTO';
import { CustomResponse } from '../types/socketResponseTypes';
// TODO: Fix players turns for the first round (it's not clear who plays first)
// TODO: Fix what happens when odd number of players. Someone has cards left. DECISION: The moment one player runs out of cards, the game ends.
export class GameEngine {
    private deck: number[] = [];
    public players: Player[] = [];
    private activePlayerId = '';
    readonly maxTurnLength: number;
    private partialHighScores: HighScoreType[] = [];
    public isGameRunning = false;
    public id: string;
    public cardsOnTable: number[] = [];
    public currentRound: number;
    public gameWinner: string = '';
    public maxPlayers: number;
    public numberOfPlayers = 0;

    constructor(maxPlayers = 4, turnLength = 15) {
        this.id = Date.now().toString(36);
        this.currentRound = 0;
        this.maxTurnLength = turnLength * 1000;
        this.maxPlayers = maxPlayers;
    }

    private initDeck() {
        for (let i = 2; i <= 14; i++) {
            for (let j = 1; j <= 4; j++) {
                this.deck.push(parseFloat(`${i}.${j}`));
            }
        }
        this.shuffleDeck();
    }

    private shuffleDeck() {
        this.deck.sort(() => Math.random() - 0.5);
    }

    private dealCards(cardsPerPlayer: number) {
        if (this.deck.length < this.players.length) {
            console.warn('No enough cards left in the deck.');
            return;
        }
        for (const player of this.players) {
            if (player.state === 'played') {
                continue;
            }
            player.hand = this.deck.splice(0, cardsPerPlayer);
        }
    }

    public addPlayer(player: Player): CustomResponse {
        const isDuplicatePlayer = this.players.some(
            (existingPlayer) => existingPlayer.id === player.id
        );

        if (isDuplicatePlayer) {
            return {
                success: true,
                message: 'The player is already in the game.',
            };
        }

        if (this.players.length >= this.maxPlayers) {
            return {
                success: false,
                message: 'Game is full.',
            };
        }

        if (this.isGameRunning) {
            return {
                success: false,
                message: 'Game is already running',
            };
        }

        this.players.push(player);
        this.numberOfPlayers++;

        player.state = 'waiting';

        return {
            success: true,
            message: 'Player successfully added',
        };
    }

    public startGame(): CustomResponse {
        if (this.isGameRunning) {
            return {
                success: false,
                message: 'Game is already running',
            };
        }

        if (this.players.length <= 1) {
            return {
                success: false,
                message: 'Not enough players to start the game',
            };
        }

        const currentPlayer =
            this.players[Math.floor(Math.random() * this.players.length)];

        this.activePlayerId = currentPlayer.id;

        this.initDeck();
        this.dealCards(6);
        this.cardsOnTable = [];
        this.startRound(currentPlayer!);
        this.isGameRunning = true;
        return {
            success: true,
            message: 'Starting game',
        };
    }

    public startRound(currentPlayer: Player) {
        this.currentRound++;

        if (this.deck.length === 0) {
            if (this.players.every((player) => player.hand.length === 0)) {
                this.endGame();
                return;
            }
            this.startPlayerAction(currentPlayer);
            return;
        }

        this.players.forEach((player: Player) => {
            player.state = 'waiting';
            if (player.hand.length < 6) {
                this.getNewCard(player);
            }
        });

        currentPlayer.state = 'active';

        this.startPlayerAction(currentPlayer);
    }

    private startPlayerAction(player: Player) {
        this.activePlayerId = player.id;
    }

    public getNewCard(player: Player) {
        player.hand.push(this.deck.shift()!);
    }

    public playCard(player: Player, cardPlayed: number): CustomResponse {
        if (this.activePlayerId !== player.id) {
            return {
                success: false,
                message: "This is not this players' action",
            };
        }
        console.log(`${player.name} played ${cardPlayed}`);

        this.cardsOnTable.push(cardPlayed);
        this.endPlayerAction(player);
        return {
            success: true,
            message: `${player.name} played ${cardPlayed}`,
        };
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

    private computeRoundWinner(): Player | undefined {
        const highestCardValue = Math.max(...this.cardsOnTable);
        const winningPlayer = this.players.find(
            (player) => player.playedCard === highestCardValue
        );

        if (winningPlayer) {
            winningPlayer.winRound(this.cardsOnTable);
            return winningPlayer;
        } else {
            console.log('Winner could not be determined');
            return;
        }
    }

    public finishRound() {
        const roundResult = this.computeRoundWinner();
        this.partialHighScores = this.computeHighScores();

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
        this.players.forEach((player) => {
            player.state = 'waiting';
            player.playedCard = null;
        });
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
        this.isGameRunning = false;
        this.players.forEach((player) => player.setPlayerStatus('waiting'));
        console.log(winnerAnnouncement);
    }

    public getActivePlayerIndex() {
        return this.activePlayerId;
    }

    public getCurrentPlayers() {
        return this.players;
    }

    public toDTO(): GameDTO {
        const {
            id,
            players,
            maxPlayers,
            numberOfPlayers,
            currentRound,
            cardsOnTable,
        } = this;
        const allPlayed = players.every((player) => player.playedCard !== null);

        return {
            id,
            players,
            currentRound,
            maxPlayers,
            numberOfPlayers,
            numberOfPlayedCards: cardsOnTable.length,
            ...(allPlayed && cardsOnTable),
        };
    }
}
