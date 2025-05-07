import React from 'react';
import { getCardImage } from '../helper/getCardImage';
import { getCardName } from '../helper/getCardName';

function CardHand({ cards }) {
    const cardElements = cards?.map((card) => {
        return (
            <div key={card} className='card'>
                <img src={getCardImage(card)} alt={getCardName(card)} />
            </div>
        );
    });

    return <div className='hand'>{cardElements}</div>;
}

export default CardHand;
