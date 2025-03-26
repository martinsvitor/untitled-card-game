import {GameEngine} from "../game/gameEngine";

const gameList: GameEngine[] = [];

export function useGameState() {

    function createGame(game: GameEngine): void {
        gameList.push(game);
    }

    function removeGame(game: GameEngine): string {
        const deletedGame = gameList.find(game => game.id === game.id);
        if (deletedGame) {
            gameList.splice(gameList.indexOf(game), 1);
            return 'game deleted successfully';
        } else {
            return 'game not found';
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

