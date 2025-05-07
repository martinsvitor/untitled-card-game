import {GameEngine} from "../game/gameEngine";
import {GameSearchResult} from '../types/GameHandlingTypes';

const gameList: GameEngine[] = [];

export function useGameState() {

    function createGame(game: GameEngine): void {
        gameList.push(game);
    }

    function removeGame(game: GameEngine): GameSearchResult {
        const deletedGame = gameList.find(game => game.id === game.id);
        if (deletedGame) {
            gameList.splice(gameList.indexOf(game), 1);
            return {success: true, message: 'game deleted successfully'};
        } else {
            return {success: false, message: 'Game not found.'};
        }
    }

    function getGame(gameId: string): GameEngine | GameSearchResult {
        const game = gameList.find(game => game.id === gameId);
        if (!game) {
            return {success: false, message: 'Game not found.'};
        }
        return game
    }

    function getAllGames() {
        return gameList;
    }

    return {
        createGame,
        removeGame,
        getGame,
        getAllGames
    }
}

