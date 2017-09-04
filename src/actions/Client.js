import dispatcher from '../dispatchers/dispatcher'

export function registerClient () {
    dispatcher.dispatch({
        type: 'REGISTER_CLIENT'
    })
};

export function getChannels (cid) {
    dispatcher.dispatch({
        type: 'FETCH_CHANNELS'
    })
};

export function getWhoami (cid) {
    dispatcher.dispatch({
        type: 'FETCH_WHOAMI'
    })
};

export function getUsers (cid) {
    dispatcher.dispatch({
        type: 'FETCH_USERS',
        cid
    })
};

export function putMessages (cid, message) {
    dispatcher.dispatch({
        type: 'SAVE_MESSAGES',
        cid,
        message
    })
};

export function updateCache () {
    dispatcher.dispatch({
        type: 'FETCH_CACHEDIR'
    })
};

export function putUserImg (uid, path) {
    dispatcher.dispatch({
        type: 'SAVE_USERIMG',
        uid,
        path
    })
};