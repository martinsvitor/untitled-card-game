import { Server, Socket } from 'socket.io';
import { GameEngine } from '../../game/gameEngine';
import { Player } from '../../game/playerClass';
import { useGameState } from '../../states';

const { createGame, getGame } = useGameState();

export const setupSocket = (io: Server) => {
    // When the player gets to the game selection room
    io.on('connection', (socket: Socket) => {
        // io.emit("connection-established", socket.id);
        socket.emit('connection-established');

        socket.on('create-game', (maxPlayers: number | undefined) => {
            // When the player creates a game
            const game = new GameEngine(maxPlayers);
            createGame(game);
            io.emit('new-game', game);
            socket.emit('game-created', game.id);
        });

        socket.on(
            'join-game',
            (gameId: string, playerId: string, playerName: string) => {
                console.log('Player joined', playerId, playerName);
                const chosenGame = getGame(gameId);
                if (!chosenGame) {
                    socket.emit('join-response', {
                        isPermitted: false,
                        message: 'Game not found',
                    });
                    return;
                }
                if (chosenGame.numberOfPlayers >= chosenGame.maxPlayers) {
                    socket.emit('join-response', {
                        isPermitted: false,
                        message: 'Game already full',
                    });
                    return;
                }
                const player = new Player(playerId, playerName);
                chosenGame.addPlayer(player);
                io.emit('new-player', chosenGame); // Notify other players

                socket.emit('join-response', {
                    isPermitted: true,
                    message: 'Joining successful',
                    gameData: chosenGame,
                });
            }
        );

        console.log(`User connected: ${socket.id}`);
        // console.log('!!!! IO ',io.sockets);
        // io.to(socket.id).emit("connectionEstablished", io);
        socket.emit('testConnection');

        // socket.on('createGame', (maxPlayers: number) => {
        //     // When the player creates a game
        //     const game = new GameEngine(maxPlayers);
        //     socket.emit('newGame', game);
        //
        //     socket.on("playerJoin", (playerData: Player) => {
        //         if (game.getCurrentPlayers().length > maxPlayers) {
        //             io.to(socket.id).emit('fullRoom');
        //         } else {
        //             const player = new Player(playerData.id, playerData.name);
        //             game.addPlayer(player);
        //             console.log(`Player joined:`, playerData);
        //
        //             socket.emit("newPlayer", playerData); // Notify other players
        //         }
        //     });
        //
        //     socket.on('startGame', () => {
        //         if (game.getCurrentPlayers().length < 2) {
        //             console.log('Not enough players');
        //             socket.emit("game started");
        //         } else {
        //             game.startGame();
        //             console.log('Starting the game');
        //             socket.emit("game started");
        //         }
        //     })
        //
        //     socket.on("gameAction", (data) => {
        //         console.log("Game action received:", data);
        //         io.emit("gameUpdate", {status: "updated", data});
        //     });
        // })

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
