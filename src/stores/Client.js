import { EventEmitter } from "events"

class ClientStore extends EventEmitter {
    constructor() {
        super()
        this.client = {};
    }

    getClient() {
        return this.client;
    }
}

const ClientStore = new ClientStore

export default ClientStore