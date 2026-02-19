//@ts-check
/** @typedef {import("./index.js").User} User */
/** @typedef {import("./index.js").Wallet} Wallet */
/** @typedef {import("./index.js").Transaction} Transaction */


class Store {
    constructor() {
        this.Users = new Users()
        this.Wallets = new Wallets()
        this.Transactions = new Transations()
    }
}


new Store().Transactions

class Users {
    /** @type {Map<string, User>} */
    #data
    constructor() {
        this.#data = new Map()
    }
}

class Wallets {
    /** @type {Map<string, Wallet>} */
    #data
    constructor() {
        this.#data = new Map()
    }
}

class Transations {
    /** @type {Map<string, Transaction>} */
    #data
    constructor() {
        this.#data = new Map()
    }
    /**
     * 
     * @param {Transaction} T 
     */
    create(T){

    }
    /**
     * @param {string} id 
     * @returns {Transaction|undefined}  
     */
    get(id){
        return this.#data.get(id)
    }
    
    /**
     * @returns {Transaction[]}  
     */
    get_all(){
       return Array.from(this.#data.values())

    }
}

export default Store;