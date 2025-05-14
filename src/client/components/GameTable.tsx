import React from 'react';
import CardHand from './CardHand';
import { CardItem } from '../../server/types/cardItem';

function GameTable({cards}: { cards: CardItem[] | undefined }) {
    return (
        <div>
            <CardHand cards={ cards?.map(card => card.value) }/>
        </div>
    );
}

export default GameTable;
