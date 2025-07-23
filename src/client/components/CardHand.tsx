import React, { useContext } from 'react';
import { getCardImage } from '../helper/getCardImage';
import { getCardName } from '../helper/getCardName';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';
import { PlayerType } from '../../server/types/playerType';

interface CardHandProps {
    cards: number[] | undefined;
    gameId: string;
    player: PlayerType;
}

function CardHand({ cards, gameId, player }: CardHandProps) {
    const { userId } = useContext(GlobalContext);
    console.log(player);
    function playCard(card: number) {
        if (player.state === 'active') {
            socket.emit('player-action', gameId, userId, card);
        }
        return;
    }

    const cardElements = cards?.map((card) => {
        return (
            <div onClick={() => playCard(card)} key={card} className='card'>
                <img src={getCardImage(card)} alt={getCardName(card)} />
            </div>
        );
    });

    return <div className='hand'>{cardElements}</div>;
}

export default CardHand;
