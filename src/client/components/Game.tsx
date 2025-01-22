import { useParams } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import { socket } from '../App';

function Game() {
    const { gameId } = useParams();

    useEffect(() => {
        // async function requestJoining() {
        //     const response = await axios.get(`/api/${gameId}`);

        // }
        socket.emit('join-game', gameId);
        socket.on('join-response', (message) => {
            console.log(message);
        });
    }, []);

    console.log(gameId);
    return <div>You're in the game! Game ID: {gameId}</div>;
}

export default Game;
