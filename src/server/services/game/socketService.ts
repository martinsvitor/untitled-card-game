import {Server, Socket} from 'socket.io';
import {GameEngine} from '../../game/gameEngine';
import {Player} from '../../game/playerClass';
import {useGameState} from '../../states';
import {JoinResponse} from '../../types/socketResponseTypes';

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

        socket.on('get-game-list', (respond: (gameList: GameEngine[]) => {}) => {
            const gameList = getAllGames();
            respond(gameList);
        })

        socket.on(
            'join-game',
            (gameId: string, playerId: string, playerName: string, respond: (data: JoinResponse) => {}) => {
                console.log('Player joined', playerId, playerName);
                const chosenGame = getGame(gameId);
                if (!chosenGame) {
                    return respond({
                        isPermitted: false,
                        message: 'Game not found'
                    });
                }
                if (chosenGame.numberOfPlayers >= chosenGame.maxPlayers) {
                    return respond({
                        isPermitted: false,
                        message: 'Game already full'
                    });
                }
                const player = new Player(playerId, playerName);
                chosenGame.addPlayer(player);
                socket.join(gameId)

                // Notify other players
                io.emit('game-list-update', chosenGame);

                respond({
                    isPermitted: true,
                    message: 'Joining successful',
                    gameData: chosenGame,
                });

                // Notifying all players in the same Game Room
                io.to(gameId).emit('game-update', chosenGame);
            }
        );

        // socket.on('change-ready', (gameId: string, playerId: string, isPlayerReady: boolean) => {
        //     const currentGame = getGame(gameId);
        //     const currentPlayer = currentGame?.getCurrentPlayers().find((player: Player) => player.id === playerId)
        //     if (currentPlayer) {
        //         if (isPlayerReady) {
        //             currentPlayer.state = 'ready';
        //             io.to(gameId).emit('change-ready', currentPlayer.state );
        //         } else {
        //             currentPlayer.state = 'waiting';
        //         }
        //     }
        // })

        console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
