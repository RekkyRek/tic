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
}

const ClientStore = new ClientStore
dispatcher.register()

export default ClientStore