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
    })
});