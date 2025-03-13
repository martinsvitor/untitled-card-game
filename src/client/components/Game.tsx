import { useParams, useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';

function Game() {
    const { setMessage } = useContext(GlobalContext);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [permissionReceived, setPermissionReceived] = useState(false);
    const [gameData, setGameData] = useState({});

    useEffect(() => {
        socket.emit('join-game', gameId);
        socket.on('join-response', (response) => {
            const { isPermitted, gameData } = response;
            if (isPermitted) {
                setPermissionReceived(true);
                setGameData(gameData);
            } else {
                setMessage('Could not join game');
                navigate('/');
            }
        });
    }, []);

    return permissionReceived ? (
        <div>
            <h2>You're in the game! Game ID: {gameId}</h2>
            <p>Status: {gameData.status}</p>
        </div>
    ) : (
        <div>Joining...</div>
    );
}

export default Game;
