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
    const thisPlayerPosition = players?.indexOf(thisPlayer!);
    const playersOrderAdjusted = players
        ?.slice(thisPlayerPosition)
        .concat(players?.slice(0, thisPlayerPosition));

    const otherPlayers = playersOrderAdjusted?.filter(
        (player) => player.id != userId
    );
    console.log('Players length: ', players.length);
    const otherPlayersHands = otherPlayers?.map((player, index) => (
        <CardHand
            gameId={gameId}
            player={player}
            relativePosition={(index + 1) / players!.length}
            key={player.id}
            isFaceDown
        />
    ));

    return (
        <div>
            {otherPlayersHands}
            <PlayedCards players={players} />
            <CardHand
                gameId={gameId}
                player={thisPlayer!}
                relativePosition={0}
            />
        </div>
    );
}

export default GameTable;
