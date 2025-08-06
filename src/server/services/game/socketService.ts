import {Server, Socket} from 'socket.io';
import {GameEngine} from '../../game/gameEngine';
import {Player} from '../../game/playerClass';
import {useGameState} from '../../states';
import {CustomResponse} from '../../types/socketResponseTypes';

const {createGame, getGame, getAllGames} = useGameState();

export const setupSocket = (io: Server) => {
    // When the player gets to the game selection room
    io.on('connection', (socket: Socket) => {
        socket.on('create-game', (respond: (gameId: string) => {}) => {
            // When the player creates a game
            const game = new GameEngine();
            createGame(game);
            respond(game.id);
        });

        socket.on(
            'get-game-list',
            (respond: (gameList: GameEngine[]) => {}) => {
                const gameList = getAllGames();
                respond(gameList);
            }
        );

        socket.on('join-game',
            (
                gameId: string,
                playerId: string,
                playerName: string,
                respond: (response: CustomResponse) => {}
            ) => {
                console.log('Player joined', playerId, playerName);
                const chosenGame = getGame(gameId);
                if (!(chosenGame instanceof GameEngine)) {
                    return respond({
                        success: false,
                        message: 'Game not found.',
                    });
                }

                const player = new Player(playerId, playerName);
                const addPlayerResponse = chosenGame.addPlayer(player);
                socket.join(gameId);

                // Notify other players
                io.emit('game-list-update', chosenGame.toDTO());

                if (addPlayerResponse.success) {
                    // Notifying all players in the same Game Room
                    io.to(gameId).emit('game-update', {
                        success: addPlayerResponse.success,
                        message: addPlayerResponse.message,
                        gameData: chosenGame.toDTO(),
                    });

                    return respond({
                        success: addPlayerResponse.success,
                        message: addPlayerResponse.message,
                        gameData: chosenGame.toDTO(),
                    })
                } else {
                    return respond(addPlayerResponse);
                }
            }
        );

        socket.on(
            'change-ready',
            (gameId: string, playerId: string, isPlayerReady: boolean) => {
                const currentGame = getGame(gameId);
                if (!(currentGame instanceof GameEngine)) {
                    // Handle error
                    return;
                }
                const currentPlayer = currentGame
                    .getCurrentPlayers()
                    .find((player: Player) => player.id === playerId);
                // TODO: In Else condition, we should return to avoid starting game, right?
                if (currentGame && currentPlayer) {
                    if (isPlayerReady) {
                        const response = currentPlayer.setPlayerStatus('ready');
                        io.to(gameId).emit('game-update', {
                            success: response.success,
                            message: response.message,
                            gameData: currentGame.toDTO(),
                        } as CustomResponse);
                    } else {
                        const response =
                            currentPlayer.setPlayerStatus('waiting');
                        io.to(gameId).emit('game-update', {
                            success: response.success,
                            message: response.message,
                            gameData: currentGame.toDTO(),
                        });
                    }
                    const allReady = currentGame.players.every(
                        (player) => player.state === 'ready'
                    );
                    if (
                        currentGame.getCurrentPlayers().length > 1 &&
                        allReady
                    ) {
                        const gameResponse = currentGame.startGame();
                        console.log(gameResponse);
                        io.to(gameId).emit('game-update', {
                            success: gameResponse.success,
                            message: gameResponse.message,
                            gameData: currentGame.toDTO(),
                        } as CustomResponse);
                    }
                }
            }
        );

        socket.on(
            'player-action',
            (
                gameId: string,
                playerId: string,
                card: number,
                respond: (response: CustomResponse) => {}
            ) => {
                const currentGame = getGame(gameId);
                if (!(currentGame instanceof GameEngine)) {
                    return respond({
                        success: false,
                        message: 'Game not found.',
                    });
                }
                const currentPlayer = currentGame.players.find(
                    (player) => player.id === playerId
                );
                if (currentPlayer) {
                    const actionResponse = currentPlayer.playCard(
                        card,
                        currentGame
                    );
                    io.to(gameId).emit('game-update', {
                        success: actionResponse.success,
                        message: actionResponse.message,
                        gameData: currentGame.toDTO(),
                    });
                }
            }
        );

        console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
