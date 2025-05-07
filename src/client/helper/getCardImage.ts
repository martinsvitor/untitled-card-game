export function getCardImage(cardValue: number) {
    const imageLocation = '../assets/cards/';

    const cardImages = import.meta.glob('../assets/cards/*.png', {
        eager: true,
        import: 'default',
    });

    const rankValue = cardValue.toString().split('.')[0];
    const suitValue = cardValue.toString().split('.')[1];

    const rankLookup = {
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': 'jack',
        '12': 'queen',
        '13': 'king',
        '14': 'ace',
    };

    const suitLookup = {
        '1': 'diamonds',
        '2': 'hearts',
        '3': 'spades',
        '4': 'clubs',
    };

    const rank = rankLookup[rankValue];
    const suit = suitLookup[suitValue];

    if (!rank || !suit) {
        return null;
    }

    return cardImages[`${imageLocation}${suit}_${rank}.png`];
}
