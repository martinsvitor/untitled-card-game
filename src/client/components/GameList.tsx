import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { socket } from '../helper/socketHandler';

function GameList() {
    const navigate = useNavigate();

    const [games, setGames] = useState([]);

    useEffect(() => {
        socket.on('game-created', (gameId: string) => {
            navigate(`/${gameId}`);
        });
    }, []);

    function displayList(games) {
        return games?.map((game) => {
            const { id } = game;
            return (
                <li key={id}>
                    <Link to={id}>{id}</Link>
                </li>
            );
        });
    }

    return (
        <div>
            GameList
            <button onClick={() => socket.emit('create-game')}>
                Create game
            </button>
            <ul>{displayList(games)}</ul>
        </div>
    );
}

export default GameList;
