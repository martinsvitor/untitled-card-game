import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {socket} from '../helper/socketHandler';
import React from 'react';
import {GameEngine} from '../../server/game/gameEngine';

function GameList() {
    const navigate = useNavigate();

    const [games, setGames] = useState<GameEngine[]>([]);

    const createGame = () => {
        socket.emit('create-game', (response: string) => {
            navigate(`/${response}`);
        })
    };

    useEffect(() => {
        socket.emit('get-game-list', (gameList: GameEngine[]) => {
            setGames(gameList);
        });

        socket.on('game-list-update', (game: GameEngine) => {
            setGames((previousList) => [
                ...previousList.filter(existingGame => existingGame.id !== game.id),
                game
            ]);
        });

        return () => {
            socket.removeAllListeners();
        }
    }, []);

    function displayList(games: GameEngine[]) {
        return games?.map((game) => {
            const {id, players} = game;
            return (
                <li key={id}>
                    <Link to={id}>{id} - {game.players.length}/{game.maxPlayers}</Link>
                </li>
            );
        });
    }

    return (
        <div>
            GameList
            <button onClick={createGame}>
                Create game
            </button>
            <ul>{displayList(games)}</ul>
        </div>
    );
}

export default GameList;
