import React from 'react';
import Card from './Card';
import { PlayerType } from '../../server/types/playerType';

function PlayedCards({ players }: { players: PlayerType[] | undefined }) {
    if (!players) {
        return <></>;
    }

    const playedCards = players
        .map((player) => {
            return player.playedCard;
        })
        .filter((playedCards) => playedCards);

    const playedCardImages = playedCards.map((card) => {
        return <Card key={card} cardValue={card!} />;
    });
    return <div>{playedCardImages}</div>;
}

export default PlayedCards;
