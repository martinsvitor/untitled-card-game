import { GameEngine } from "../game/gameEngine";
import { CustomResponse } from '../types/socketResponseTypes';

const gameList: GameEngine[] = [];

export function useGameState() {

    function createGame(game: GameEngine): void {
        gameList.push(game);
    }

    function removeGame(game: GameEngine): CustomResponse {
        const deletedGame = gameList.find(game => game.id === game.id);
        if (deletedGame) {
            gameList.splice(gameList.indexOf(game), 1);
            return {success: true, message: 'game deleted successfully'};
        } else {
            return {success: false, message: 'Game not found.'};
        }
    }

    function getGame(gameId: string) {
        return gameList.find(game => game.id === gameId);
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

