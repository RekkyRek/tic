import { EventEmitter } from "events"

import dispatcher from '../dispatchers/dispatcher'

import ts3client from 'ts3-clientquery'
const client = ts3client.newQuery()

import * as Helpers from '../components/Utils/Helpers';

const fs = require('fs');
const mime = require('mime');

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
        this.whoami = {};
        this.channels = [];
        this.users = [];
        this.messages = {};
        this.cacheDir = localStorage.getItem('ts3cache');
        this.ready = false;

        if(localStorage.getItem('messages') != undefined) {
            this.messages = JSON.parse(localStorage.getItem('messages'));
            console.log(this.messages)
        }
    }
    reqUsers(cid) {
        console.log('reqUsers')
        this.client.request(`channelclientlist cid=${cid} -voice -uid`)
            .then((res)=>{
                if(Array.isArray(this.client.parse(res))) {
                    let users = [];
                    res.toString().split("|").forEach((r)=>{
                        users.push(this.client.parse(r))
                    })
                    console.log('users', users)
                    this.users = [...users];
                    console.log('thisusers', users)
                    this.emit("update");                     
                } else {
                    this.users = [...[this.client.parse(res)]];
                    console.log('users',this.users)
                    this.emit("update");                     
                }

                this.client.notifyOn('notifytalkstatuschange','schandlerid=1', (res) => {
                    let udat = this.client.parse(res);
                    let users = this.users;
                    this.users.forEach(function(user) {
                        if(user.clid == udat.clid) {
                            users[users.indexOf(user)].client_flag_talking = udat.status;
                        }
                    }, this);
                    this.users = users;
                    this.emit("update");
                })
            })
    }

    ts3Cache() {
        this.client.request('servervariable virtualserver_unique_identifier')
            .then((res)=>{
                console.log('cache',res.toString(), res.toString().split('\n\r')[1], this.client.parse(res.toString()));
                const vuid = res.toString().split('\n\r')[1];
                console.log('vuid',vuid.substr(vuid.indexOf('=')+1))
                this.cacheDir = `${require('os').homedir()}/.ts3client/cache/${btoa(vuid.substr(vuid.indexOf('=')+1))}`;
                localStorage.setItem('ts3cache', this.cacheDir);
                this.emit("update");
            })
    }

    reqChannels() {
        this.client.request('channellist')
            .then((res)=>{
                console.log(this.channels)
                if(!this.ready) {
                    this.channels = client.parse(res)
                    this.ready = true;
                    this.emit("registered");
                } else {
                    this.channels = client.parse(res)
                    this.emit("update");
                }
            })
    }

    putMessages(cid, message) {
        if(this.messages[cid] == undefined) {this.messages[cid] = [];}
        message.time = Date.now();
        this.messages[cid].push(message);
        localStorage.setItem('messages', JSON.stringify(this.messages));
        this.emit("update");
        this.emit("msgupdate")
    }

    reqWhoami() {
        this.client.request('whoami')
            .then((res)=>{
                this.whoami = client.parse(res);
                setTimeout(()=>{
                    console.log('whomstfe')
                    if(!this.ready) {this.reqChannels()} else {this.emit("update")}
                    this.emit("update");                 
                }, 50)
            });
    }

    registerClient() {
        client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
            .then((res)=>{
                this.client = res;
                console.log(res)
                setTimeout(()=>{
                    console.log('whima')
                    this.reqWhoami();
                }, 50)
            })
    }
    
    handleAction(action) {
        switch(action.type) {
            case "REGISTER_CLIENT":
                this.registerClient();
                break;
            case "FETCH_USERS":
                this.reqUsers(action.cid);
                break;
            case "FETCH_WHOAMI":
                this.reqWhoami();
                break;
            case "SAVE_MESSAGES":
                this.putMessages(action.cid, action.message);
                break;
            case "FETCH_CACHEDIR":
                this.ts3Cache();
                break;
            case "SAVE_USERIMG":
                this.buildUsers(action.user);
                break;
        }
    }
}

const clientStore = new ClientStore
dispatcher.register(clientStore.handleAction.bind(clientStore))

window.clientStore = clientStore;

export default clientStore