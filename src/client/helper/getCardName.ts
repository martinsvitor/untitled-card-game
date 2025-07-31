export function getCardName(cardValue: number): string {
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
        '11': 'Jack',
        '12': 'Queen',
        '13': 'King',
        '14': 'Ace',
    };

    const suitLookup = {
        '1': 'Diamonds',
        '2': 'Hearts',
        '3': 'Spades',
        '4': 'Clubs',
    };

    const rank = rankLookup[rankValue];
    const suit = suitLookup[suitValue];

    if (!rank || !suit) {
        return 'Invalid card value';
    }

    return `${suit} ${rank}`;
}
