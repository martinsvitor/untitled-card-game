import './App.css';
import { useState, useEffect, createContext } from 'react';
import setUserCookie from './helper/setUserCookie';
import Router from './components/Router';
import WelcomeOverlay from './components/WelcomeOverlay';

export const GlobalContext = createContext({});

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setUserId(setUserCookie());
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }

        setIsLoading(false);
    }, []);

    return (
        <GlobalContext.Provider
            value={{ userId, username, setUsername, isLoading, setMessage }}
        >
            <div className='App'>
                {message}
                {username && <Router />}
                {!isLoading && !username && <WelcomeOverlay />}
            </div>
        </GlobalContext.Provider>
    );
}

export default App;
