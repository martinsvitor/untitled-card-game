import { useState, Dispatch, SetStateAction } from 'react';

interface Prop {
    setUsername: Dispatch<SetStateAction<string>>;
}

function UsernameInput({ setUsername }: Prop) {
    const [usernameInput, setUsernameInput] = useState('');

    const saveUsername = (input: string) => {
        setUsername(input);
        localStorage.setItem('username', input);
    };

    return (
        <form onSubmit={() => saveUsername(usernameInput)}>
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
