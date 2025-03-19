import {Server, Socket} from "socket.io";
import {GameEngine} from "../../game/gameEngine";
import {Player} from "../../game/playerClass";
import {useGameState} from "../../states";

const {createGame, getGame} = useGameState()

export const setupSocket = (io: Server) => {
    // When the player gets to the game selection room
    io.on("connection", (socket: Socket) => {
        io.to(socket.id).emit("connectionEstablished", socket.id);

        socket.on('create-game', (maxPlayers: number) => {
            // When the player creates a game
            const game = new GameEngine(maxPlayers);
            createGame(game);
            console.log('received createGame', maxPlayers);
            socket.emit('new-game', game);
        })

        socket.on("player-join", (gameId: string, playerId: string, playerName: string) => {
            console.log('Player joined', playerId, playerName);
            const chosenGame = getGame(gameId);
            if (!chosenGame) {
                socket.emit('game-not-found');
                return;
            }
            const player = new Player(playerId, playerName);
            chosenGame.addPlayer(player);
            socket.emit("new-player", playerName); // Notify other players
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
