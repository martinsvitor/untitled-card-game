import { v4 as generateUserId, validate as validateUserId } from 'uuid';

function setUserCookie() {
    let userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))
        ?.split('=')
        .at(1);

    if (!validateUserId(userId)) {
        userId = generateUserId();
    }

    document.cookie = `userId=${userId}; max-age=${60 * 60 * 24 * 365}`;
}

export default setUserCookie;
