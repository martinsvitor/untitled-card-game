import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import setUserCookie from './helper/setUserCookie';
import UsernameInput from './components/UsernameInput';
import Router from './components/Router';

const socket = io();

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

    // function emitEvent() {
    //     console.log('! clicked', count);
    //     socket.emit('test', count);
    // }

    return (
        <div className='App'>
            {!username ? 'Hello!' : `Hello ${username}!`}
            {!username && !isLoading && (
                <UsernameInput setUsername={setUsername} />
            )}
            <Router />
        </div>
    );
}

export default App;
