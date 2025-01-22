import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect, createContext } from 'react';
import setUserCookie from './helper/setUserCookie';
import Router from './components/Router';
import WelcomeOverlay from './components/WelcomeOverlay';

export const socket = io();
export const UserContext = createContext({});

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUserCookie();
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }

        setIsLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername, isLoading }}>
            <div className='App'>
                {username && <Router />}
                {!isLoading && !username && <WelcomeOverlay />}
            </div>
        </UserContext.Provider>
    );
}

export default App;
