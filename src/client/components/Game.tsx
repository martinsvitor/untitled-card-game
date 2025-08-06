import {useParams, useNavigate} from 'react-router';
import {useEffect, useState, useContext} from 'react';
import {socket} from '../helper/socketHandler';
import {GlobalContext} from '../App';
import React from 'react';
import GameTable from './GameTable';
import {GameDTO} from '../../server/types/GameDTO';
import {CustomResponse} from '../../server/types/socketResponseTypes';

enum ReadyColors {
    Green = '#006400',
    Red = '#8B0000'
}

function Game() {
    const {setMessage, userId, username} = useContext(GlobalContext);
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [isPlayerReady, setPlayerReady] = useState(false);
    const [gameState, setGameState] = useState<GameDTO>();
    const [readyButtonColor, setReadyButtonColor] = useState<ReadyColors>(ReadyColors.Red)
    const playerHand = gameState?.players.find(
        (player) => player.id === userId
    )?.hand;

    useEffect(() => {
        socket.emit(
            'join-game',
            gameId,
            userId,
            username,
            (response: CustomResponse) => {
                const {success, message, gameData} = response;

                if (success) {
                    setWaitingForResponse(false);
                    setGameState(gameData);
                } else {
                    setMessage(message);
                    navigate('/');
                }
            }
        );

        socket.on('game-update', (response: CustomResponse) => {
            setGameState(response.gameData);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        setReadyButtonColor((previousState) => {
            if (previousState === ReadyColors.Green) {
                return ReadyColors.Red;
            } else {
                return ReadyColors.Green;
            }
        });
    }, [isPlayerReady]);

    return waitingForResponse ? (
        <div>Joining...</div>
    ) : (
        <div>
            <h2>You're in the game! Game ID: {gameId}</h2>
            <p>Players: {gameState?.numberOfPlayers}</p>

            <button
                onClick={() => {
                    setPlayerReady(!isPlayerReady);
                    socket.emit('change-ready', gameId, userId, !isPlayerReady);
                }}
                style={{color: readyButtonColor}}
            >
                Ready
            </button>
            <GameTable
                gameId={gameId!}
                players={gameState?.players}
                userId={userId}
            />
        </div>
    );
}

export default Game;
