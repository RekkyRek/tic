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