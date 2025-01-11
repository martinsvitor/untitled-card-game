import {CardItem} from "./cardItem.js";
import {PlayerState} from "./playerState.js";

export interface PlayerType {
    id: string;
    name: string;
    hand: CardItem[];
    collectedCards: CardItem[];
    state: PlayerState;
}