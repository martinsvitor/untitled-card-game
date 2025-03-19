import {Server, Socket} from "socket.io";
import {GameEngine} from "../../game/gameEngine";
import {Player} from "../../game/playerClass";
import {useGameState} from "../../states";

const {createGame, getGame} = useGameState()

export const setupSocket = (io: Server) => {
    // When the player gets to the game selection room
    io.on("connection", (socket: Socket) => {
        // io.emit("connection-established", socket.id);
        socket.emit('connection-established');

        socket.on('create-game', (maxPlayers: number) => {
            // When the player creates a game
            const game = new GameEngine(maxPlayers);
            createGame(game);
            io.emit('new-game', game);
        })

        socket.on("join-game", (gameId: string, playerId: string, playerName: string) => {
            console.log('Player joined', playerId, playerName);
            const chosenGame = getGame(gameId);
            if (!chosenGame) {
                socket.emit('game-not-found');
                return;
            }
            const player = new Player(playerId, playerName);
            chosenGame.addPlayer(player);
            io.emit("new-player", chosenGame); // Notify other players
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
