import {Player} from "../game/playerClass";

export interface HighScoreType {
    player: typeof Player;
    points: number;
}