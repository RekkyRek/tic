import { EventEmitter } from "events"

import dispatcher from '../dispatchers/dispatcher'

import ts3client from '/media/hampus/Anis/ts3-clientquery/'
const client = ts3client.newQuery()

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
        this.whoami = {};
        this.channels = [];
    }

    reqChannels() {
        this.client.request('channellist')
            .then((res)=>{
                if(this.channels == []) {
                    this.channels = client.parse(res)
                    this.emit("registered");
                } else {
                    this.channels = client.parse(res)
                    this.emit("update");                     
                }
            })
    }
    
    reqWhoami() {
        this.client.request('whoami')
            .then((res)=>{
                this.whoami = client.parse(res);
                    setTimeout(()=>{
                    if(this.channels.length == 0) {this.reqChannels()} else {this.emit("update")}
                    this.emit("update");                 
                }, 50)
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

window.clientStore = clientStore;

export default clientStore