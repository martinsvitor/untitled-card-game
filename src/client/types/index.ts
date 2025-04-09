import {Dispatch, SetStateAction} from 'react';
import {GameEngine} from '../../server/game/gameEngine';

export interface AppContext {
    userId: string,
    username: string,
    setUsername: Dispatch<SetStateAction<string>>,
    isLoading: boolean,
    setMessage: Dispatch<SetStateAction<string>>,
}
 export interface JoinResponse {
     isPermitted: boolean;
     message: string;
     gameData?: GameEngine
 }
