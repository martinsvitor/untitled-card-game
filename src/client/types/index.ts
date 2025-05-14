import { Dispatch, SetStateAction } from 'react';
import { GameDTO } from '../../server/types/GameDTO';

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
     gameData?: GameDTO;
 }
