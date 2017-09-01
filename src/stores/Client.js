import { EventEmitter } from "events"

import dispatcher from '../dispatchers/dispatcher';

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
    }

    registerClient() {
        client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
            .then((res)=>{
                this.client = res;
            })
        this.emit("registered");
    }

    getClient() {
        return this.client;
    }

    handleActions(action) {
        console.log('action', action);
    }
}

const clientStore = new ClientStore
dispatcher.register(clientStore.handleActions.bind(clientStore))

export default clientStore