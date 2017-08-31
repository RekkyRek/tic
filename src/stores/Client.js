import { EventEmitter } from "events"

class ClientStore extends EventEmitter {
    constructor() {
        super()
    }
}

const ClientStore = new ClientStore

export default ClientStore