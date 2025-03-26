import { useParams, useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';

function Game() {
    const { setMessage, userId, username } = useContext(GlobalContext);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [gameData, setGameData] = useState({});

    useEffect(() => {
        socket.emit('join-game', gameId, userId, username);
        socket.on('join-response', (response) => {
            const { isPermitted, message, gameData } = response;
            if (isPermitted) {
                setWaitingForResponse(false);
                setGameData(gameData);
            } else {
                setMessage(message);
                navigate('/');
            }
        });
    }, []);

    return waitingForResponse ? (
        <div>Joining...</div>
    ) : (
        <div>
            <h2>You're in the game! Game ID: {gameId}</h2>
            <p>Players: {gameData?.numberOfPlayers}</p>
        </div>
    );
}

export default Game;
