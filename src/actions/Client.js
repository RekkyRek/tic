import dispatcher from '../dispatchers/dispatcher'

export function registerClient () {
    dispatcher.dispatch({
        type: 'REGISTER_CLIENT'
    })
};

export function getUsers (cid) {
    dispatcher.dispatch({
        type: 'FETCH_USERS',
        cid
    })
};

