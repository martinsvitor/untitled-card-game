import React from 'react';
import CardHand from './CardHand';
import { PlayerType } from '../../server/types/playerType';

interface GameTableProps {
    cards: number[] | undefined;
    gameId: string;
    players: PlayerType[] | undefined;
    userId: string;
}

function GameTable({ cards, gameId, players, userId }: GameTableProps) {
    const thisPlayer = players?.find((player) => player.id === userId);

    return (
        <div>
            <CardHand cards={cards} gameId={gameId} player={thisPlayer} />
        </div>
    );
}

export default GameTable;
