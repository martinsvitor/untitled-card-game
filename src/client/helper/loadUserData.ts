import axios from 'axios';

async function loadUserData() {
    const { data: userData } = await axios.get('/api');
    try {
        console.log(userData);
        return userData;
    } catch (error) {
        console.log(error);
    }
}

export default loadUserData;
