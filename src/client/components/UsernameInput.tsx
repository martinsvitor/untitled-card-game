import { useState, useContext, Dispatch, SetStateAction } from 'react';
import { UserContext } from '../App';

interface Prop {
    setUsername: Dispatch<SetStateAction<string>>;
}

function UsernameInput() {
    const { setUsername } = useContext(UserContext);

    const [usernameInput, setUsernameInput] = useState('');

    const saveUsername = (input: string) => {
        setUsername(input);
        localStorage.setItem('username', input);
    };

    function submitName(event) {
        event?.preventDefault();
        saveUsername(usernameInput);
    }

    return (
        <form onSubmit={submitName}>
            <label htmlFor='username'>Please enter a name</label>
            <input
                name='username'
                placeholder={'Your name'}
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
            />
            <button>Submit</button>
        </form>
    );
}

export default UsernameInput;
