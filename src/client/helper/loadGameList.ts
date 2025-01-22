import axios from 'axios';

async function loadGameList() {
    const { data: gameList } = await axios.get('/api/games');
    try {
        return gameList;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default loadGameList;
