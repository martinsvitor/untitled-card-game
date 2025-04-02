import {Dispatch, SetStateAction} from 'react';

export interface AppContext {
    userId: string,
    username: string,
    setUsername: Dispatch<SetStateAction<string>>,
    isLoading: boolean,
    setMessage: Dispatch<SetStateAction<string>>,
}

