import { EventEmitter } from "events"

import dispatcher from '../dispatchers/dispatcher'

import ts3client from '/media/hampus/Anis/ts3-clientquery/'
const client = ts3client.newQuery()

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
    }

    registerClient() {
        client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
            .then((res)=>{
                this.client = res;
                this.emit("registered");
            })
    }

    getClient() {
        return this.client;
    }
    
    handleAction(action) {
        switch(action.type) {
            case "REGISTER_CLIENT":
                this.registerClient();
                break;
        }
    }
}

const clientStore = new ClientStore
dispatcher.register(clientStore.handleAction.bind(clientStore))

window.getClient = clientStore.getClient.bind(clientStore);

export default clientStore