import { EventEmitter } from "events"

import dispatcher from '../dispatchers/dispatcher'

import ts3client from '/media/hampus/Anis/ts3-clientquery/'
const client = ts3client.newQuery()

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
        this.whoami = {};
    }

    reqWhoami() {
        this.client.request('whoami')
            .then((res)=>{
                this.whoami = client.parse(res.toString());
                this.emit("registered");
            });
    }

    registerClient() {
        client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
            .then((res)=>{
                this.client = res;
                setTimeout(()=>{
                    this.reqWhoami();
                }, 50)
            })
    }

    getClient() {
        return this.client;
    }

    getWhoami() {
        return this.whoami;
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
window.getWhoami = clientStore.getWhoami.bind(clientStore);

export default clientStore