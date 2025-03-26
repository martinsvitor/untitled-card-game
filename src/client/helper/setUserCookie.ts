import { v4 as generateUserId, validate as validateUserId } from 'uuid';

function setUserCookie() {
    let userId = getUserCookie();

    if (!userId || !validateUserId(userId)) {
        userId = generateUserId();
    }

    document.cookie = `userId=${userId}; max-age=${60 * 60 * 24 * 365}`;

    return userId;
}

function getUserCookie() {
    let userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))
        ?.split('=')
        .at(1);

    return userId;
}

export default setUserCookie;
