import React from 'react';
import CardHand from './CardHand';
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
        <CardHand gameId={gameId} player={player} key={player.id} />
    ));

    return (
        <div>
            <CardHand gameId={gameId} player={thisPlayer!} isFaceUp />
            {otherPlayersHands}
        </div>
    );
}

export default GameTable;
