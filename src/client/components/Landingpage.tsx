import { useContext } from 'react';
import { Link } from 'react-router';
import { GlobalContext } from '../App';
import UsernameInput from './UsernameInput';

function Landingpage() {
    const { username, setUsername, isLoading } = useContext(GlobalContext);

    return (
        <div>
            {!username ? 'Hello!' : `Hello ${username}!`}
            {!username && !isLoading && (
                <UsernameInput setUsername={setUsername} />
            )}
            <Link to='/games'>Get a room!</Link>
        </div>
    );
}

export default Landingpage;
