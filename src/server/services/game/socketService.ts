import {Server, Socket} from 'socket.io';
import {GameEngine} from '../../game/gameEngine';
import {Player} from '../../game/playerClass';
import {useGameState} from '../../states';
import {ActionResponse, JoinResponse} from '../../types/socketResponseTypes';
import {CardItem} from '../../types/cardItem';
import {GameSearchResult} from '../../types/GameHandlingTypes';

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
                        const chosenGame: GameSearchResult = getGame(gameId);
                        if (!(chosenGame instanceof GameEngine)) {
                            return respond({
                                isPermitted: false,
                                message: chosenGame.message
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

                socket.on('change-ready', (gameId: string, playerId: string, isPlayerReady: boolean) => {
                    const currentGame = getGame(gameId);
                    if (!(currentGame instanceof GameEngine)) {
                        // Handle error
                        return;
                    }
                    const currentPlayer = currentGame.getCurrentPlayers().find((player: Player) => player.id === playerId)
                    if (currentGame && currentPlayer) {
                        if (isPlayerReady) {
                            currentPlayer.state = 'ready';
                            io.to(gameId).emit('game-update', currentGame);
                        } else {
                            currentPlayer.state = 'waiting';
                        }
                        const allReady = currentGame.players.every(player => player.state === 'ready');
                        if (currentGame.getCurrentPlayers().length > 1 && allReady) {
                            currentGame.startGame()
                        }
                    }
                });

                socket.on('player-action', (gameId: string, playerId: string, card: CardItem, respond: (data: ActionResponse) => {}) => {
                    const currentGame = getGame(gameId);
                    if (!(currentGame instanceof GameEngine)) {
                        return respond({response: {success: currentGame.success, message: currentGame.message}});
                    }
                    const currentPlayer = currentGame.players.find(player => player.id === playerId);
                    if (currentPlayer) {
                        const playerAction = currentPlayer.playCard(card, currentGame);
                        respond({response: playerAction, gameData: currentGame.toDTO()})
                    }
                })

                console.log(`User connected: ${socket.id}`);

                socket.on('disconnect', () => {
                    console.log(`User disconnected: ${socket.id}`);
                });
            }
        )
        ;
    }
;
