import React, { useContext } from 'react';
import { getCardImage } from '../helper/getCardImage';
import { getCardName } from '../helper/getCardName';
import { socket } from '../helper/socketHandler';
import { GlobalContext } from '../App';
import { PlayerType } from '../../server/types/playerType';

interface CardHandProps {
    gameId: string;
    player: PlayerType;
    isFaceUp?: boolean;
}

function CardHand({ gameId, player, isFaceUp }: CardHandProps) {
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
            <div onClick={() => playCard(card)} key={card} className='card'>
                <img src={getCardImage(card)} alt={getCardName(card)} />
            </div>
        );
    });

    const cardBacks = player.hand?.map((card) => {
        return (
            <div key={card} className='card'>
                <img src={getCardImage(0)} alt={'Back of a card'} />
            </div>
        );
    });

    return <div className='hand'>{isFaceUp ? cardImages : cardBacks}</div>;
}

export default CardHand;
