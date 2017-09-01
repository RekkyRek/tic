import dispatcher from '../dispatchers/dispatcher'

export function registerClient () {
    dispatcher.dispatch({
        type: 'REGISTER_CLIENT'
    })
};

