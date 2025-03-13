import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

function GameList() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        async function loadGameList() {
            try {
                const { data: gamesFromServer } = await axios.get('/api/games');
                setGames(gamesFromServer);
            } catch (error) {
                console.error('Error loading games: ', error);
            }
        }
        loadGameList();
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
            <ul>{displayList(games)}</ul>
        </div>
    );
}

export default GameList;
