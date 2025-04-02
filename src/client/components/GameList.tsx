import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {socket} from '../helper/socketHandler';
import React from 'react';
import {GameEngine} from '../../server/game/gameEngine';

function GameList() {
    const navigate = useNavigate();

    const [games, setGames] = useState<GameEngine[]>([]);

    useEffect(() => {
        socket.emit('get-game-list');

        socket.on('game-created', (gameId: string) => {
            navigate(`/${gameId}`);
        });

        socket.on('game-list-update', (game: GameEngine) => {
            setGames([
                ...games,
                game
            ]);
        });

        socket.on('game-list', (gameList : GameEngine[]) => {
            setGames(gameList);
        })

        return () => {
            socket.removeAllListeners();
        }
    }, []);

    function displayList(games: GameEngine[]) {
        return games?.map((game) => {
            const {id} = game;
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
