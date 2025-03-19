import {io} from "socket.io-client";
import {useEffect, useState} from "react";
import {GameEngine} from "../../server/game/gameEngine";

function Landingpage() {
    const socket = io();
    const [gameList, setGameList] = useState<GameEngine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.on('connection-established', () => console.log('still works'));
        socket.on('new-game', (game: GameEngine) => setGameList([...gameList, game]));
        socket.on('new-player', (updatedGame: GameEngine) => {
            let gameToUpdate = gameList.find(game => game.id === updatedGame.id);
            if (!loading && !gameToUpdate) {
                throw new Error('Game not found!');
            }

            setGameList([...gameList.filter(game => game.id !== updatedGame.id), updatedGame]);
        });

        setLoading(false);
    }, []);


    return (
        <div>
            Landingpage
            <button onClick={() => socket.emit('create-game', 4)}>Create game</button>
            {
                gameList.length ?
                    gameList.map((game: GameEngine) => (
                        <div key={game.id}>
                            <button
                                onClick={() => socket.emit('join-game', game.id, Date.now().toString(), `Vitor_${Date.now().toString()}`)}>{game.id}</button>
                            <span>{game.numberOfPlayers} / {game.maxPlayers}</span>
                        </div>
                    ))
                    : <p> no games created </p>
            }
        </div>);
}

export default Landingpage;
