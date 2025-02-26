import {describe, it, expect} from 'vitest';
import {GameEngine} from './gameEngine';
import {Player} from "./playerClass";

describe('GameEngine', () => {
    const game = new GameEngine(2);
    const randomUUIDVitor = crypto.randomUUID();
    const randomUUIDAljoscha = crypto.randomUUID();
    const firstPlayer = new Player(randomUUIDVitor, 'Vitor');
    const secondPlayer = new Player(randomUUIDAljoscha, 'Aljoscha');
    let roundCounter = 0;

    describe('game', () => {
        it('should initialize a shuffled deck and add players', () => {
            game.addPlayer(firstPlayer);
            game.addPlayer(secondPlayer);

            const playersAdded = game.getCurrentPlayers();
            const activePlayerId = game.getActivePlayerIndex();

            expect(playersAdded).toContain(firstPlayer);
            expect(playersAdded).toContain(secondPlayer);
            expect(activePlayerId).toEqual(randomUUIDVitor);
        });

        it('should deal 6 cards to each players and increase round number', () => {
            game.startGame();
            roundCounter++;

            expect(firstPlayer.hand).toHaveLength(6);
            expect(secondPlayer.hand).toHaveLength(6);
            expect(game.currentRound).toBe(roundCounter);
        });

        it('should have a card on the table after first player\'s turn', () => {
            const firstPlayerHand = firstPlayer.hand.sort((a,b) => b.value - a.value);
            const secondPlayerHand = secondPlayer.hand.sort((a,b) => b.value - a.value);

            const fpPlayedCard = firstPlayerHand[0];
            const spPlayedCard = secondPlayerHand[0];
            firstPlayer.playCard(firstPlayerHand[0], game);

            expect(firstPlayer.hand).toEqual(firstPlayerHand);

            expect(game.cardsOnTable).toContain(fpPlayedCard);

            secondPlayer.playCard(secondPlayerHand[0], game);
            roundCounter++;

            expect(secondPlayer.hand).toEqual(secondPlayerHand);
            expect(game.currentRound).toBe(roundCounter);
        });

        it('should have cleaned the table at the the beginning of a new round', () => {
            expect(game.cardsOnTable).toHaveLength(0)
        });

        it('should NOT allow second player to play before first', () => {
            expect(secondPlayer.playCard).toThrowError()
        })

        it('should play out the game until it\'s over', () => {
            while(firstPlayer.hand.length > 0) {
                const firstPlayerHand= firstPlayer.hand;
                const secondPlayerHand = secondPlayer.hand;
                firstPlayer.playCard(firstPlayerHand[0], game);
                secondPlayer.playCard(secondPlayerHand[0], game);
            }

            expect(game.endGame).toHaveBeenCalled();
        });

    });
});