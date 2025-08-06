import React from 'react';
import { getCardImage } from '../helper/getCardImage';
import { getCardName } from '../helper/getCardName';

interface CardProps {
    cardValue: number;
    playCard?: (card: number) => void;
    isFaceDown?: boolean;
}

function Card({ cardValue, playCard, isFaceDown }: CardProps) {
    if (isFaceDown) {
        cardValue = 0;
    }

    return (
        <div
            onClick={() =>
                !isFaceDown && playCard ? playCard(cardValue) : () => {}
            }
            key={cardValue}
            className='card'
        >
            <img src={getCardImage(cardValue)} alt={getCardName(cardValue)} />
        </div>
    );
}

export default Card;
