import React, { useContext } from 'react';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';
import { PlayerType } from '../../server/types/playerType';
import Card from './Card';

interface CardHandProps {
    gameId: string;
    player: PlayerType;
    isFaceDown?: boolean;
}

function CardHand({ gameId, player, isFaceDown }: CardHandProps) {
    const { userId } = useContext(GlobalContext);

    console.log(player);

    function playCard(card: number) {
        if (player.state === 'active') {
            socket.emit('player-action', gameId, userId, card);
        }
        return;
    }

    const cardImages = player.hand?.map((card) => {
        return (
            <Card
                cardValue={card}
                playCard={playCard}
                isFaceDown={isFaceDown}
            />
        );
    });

    return <div className='hand'>{cardImages}</div>;
}

export default CardHand;
