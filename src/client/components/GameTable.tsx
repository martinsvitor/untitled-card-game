import React from 'react';
import CardHand from './CardHand';
import PlayedCards from './PlayedCards';
import { PlayerType } from '../../server/types/playerType';

interface GameTableProps {
    gameId: string;
    players: PlayerType[] | undefined;
    userId: string;
}

function GameTable({ gameId, players, userId }: GameTableProps) {
    const thisPlayer = players?.find((player) => player.id === userId);
    const otherPlayers = players?.filter((player) => player.id != userId);
    const otherPlayersHands = otherPlayers?.map((player) => (
        <CardHand gameId={gameId} player={player} key={player.id} isFaceDown />
    ));

    return (
        <div>
            <PlayedCards players={players} />
            <CardHand gameId={gameId} player={thisPlayer!} />
            {otherPlayersHands}
        </div>
    );
}

export default GameTable;
