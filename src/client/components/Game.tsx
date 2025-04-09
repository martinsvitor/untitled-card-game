import {useParams, useNavigate} from 'react-router';
import {useEffect, useState, useContext} from 'react';
import {socket} from '../helper/socketHandler';
import {GlobalContext} from '../App';
import React from 'react';
import {GameEngine} from '../../server/game/gameEngine';
import {JoinResponse} from '../types';

function Game() {
    const {setMessage, userId, username} = useContext(GlobalContext);
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [gameState, setGameState] = useState<GameEngine>();

    useEffect(() => {
        socket.emit('join-game', gameId, userId, username, (response: JoinResponse) => {
            const {isPermitted, message, gameData} = response;

            if (isPermitted) {
                setWaitingForResponse(false);
                setGameState(gameData);
            } else {
                setMessage(message);
                navigate('/');
            }
        });

        socket.on('game-update', (updatedGame: GameEngine) => {
            setGameState(updatedGame);
        });

        // socket.on('change-ready', (playerStatus: PlayerState) => {
        //     const currentPlayer = gameState?.getCurrentPlayers().find(player => player.id === userId);
        //     if (currentPlayer) {
        //         currentPlayer.state = playerStatus;
        //     }
        // })

        return () => {
            socket.removeAllListeners();
        }

    }, []);

    return waitingForResponse ? (
        <div>Joining...</div>
    ) : (
        <div>
            <h2>You're in the game! Game ID: {gameId}</h2>
            <p>Players: {gameState?.numberOfPlayers}</p>


            {/*<button onClick={() => {*/}
            {/*    setPlayerReady(true);*/}
            {/*    socket.emit('change-ready', {*/}
            {/*        gameId: gameId,*/}
            {/*        playerId: userId,*/}
            {/*        isPlayerReady,*/}
            {/*    });*/}
            {/*}}>Ready*/}
            {/*</button>*/}
        </div>
    );
}

export default Game;
