import React, { useContext } from 'react';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';
import { PlayerType } from '../../server/types/playerType';
import Card from './Card';

interface CardHandProps {
    gameId: string;
    player: PlayerType;
    isFaceDown?: boolean;
    relativePosition: number;
}

function CardHand({
    gameId,
    player,
    isFaceDown,
    relativePosition,
}: CardHandProps) {
    const { userId } = useContext(GlobalContext);

    const angle = relativePosition * 360;
    console.log('Relative position: ', relativePosition);
    console.log('Angle: ', angle);
    function playCard(card: number) {
        if (player.state === 'active') {
            socket.emit('player-action', gameId, userId, card);
        }
        return;
    }

    const cardImages = player.hand?.map((card) => {
        return (
            <Card
                key={card}
                cardValue={card}
                playCard={playCard}
                isFaceDown={isFaceDown}
            />
        );
    });

    return (
        <div className='hand' style={{ transform: `rotate(${angle}deg)` }}>
            {cardImages}
        </div>
    );
}

export default CardHand;
