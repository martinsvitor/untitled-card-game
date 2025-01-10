import {CardItem} from "./cardItem.js";

export interface PlayerType {
    id: string;
    name: string;
    hand: CardItem[];
    collectedCards: CardItem[];
}