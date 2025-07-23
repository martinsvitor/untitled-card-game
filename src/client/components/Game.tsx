import { useParams, useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';
import React from 'react';
import GameTable from './GameTable';
import { GameDTO } from '../../server/types/GameDTO';
import { CustomResponse } from '../../server/types/socketResponseTypes';

function Game() {
    const { setMessage, userId, username } = useContext(GlobalContext);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [isPlayerReady, setPlayerReady] = useState(false);
    const [gameState, setGameState] = useState<GameDTO>();
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
                const { success, message, gameData } = response;

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
            >
                Ready
            </button>
            <GameTable
                cards={playerHand}
                gameId={gameId!}
                players={gameState?.players}
                userId={userId}
            />
        </div>
    );
}

export default Game;
