import { Transaction, User } from "./classes.js";
//@ts-check
/** @typedef {import("./classes.js").User} User */
/** @typedef {import("./classes.js").Wallet} Wallet */
/** @typedef {import("./classes.js").Transaction} Transaction */




class Store {
    constructor() {
        this.Users = new Users()
        this.Transactions = new Transactions()
        this.Wallets = new Wallets(this.Transactions)
    }
}



class Users {
  /** @type {Map<string, User>} */
  #data;
  constructor() {
    this.#data = new Map();
  }

  /**
   * @returns {User | false} false if user already exists
   * @param {string} name 
   */
  create(name) {
    const U = new User(name)
  if(this.get(U.id)) return false
    this.#data.set(
      U.id , U
    );
    return U
  }

  /**
   * @param {string} id
   * @returns {User|undefined}
   */
  get(id) {
    return this.#data.get(id);
  }
  /**
   * @returns {boolean} true if the user was updated
   * @param {User} U
   * @param {string} id
   */
  update(id , U) {
    const old_user = this.get(id);
    if (!old_user) return false;
    this.create(U);
    return true;
  }
  /**
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const user = this.get(id);
    if (!user) return false;
    this.#data.delete(id);
    return true;
  }
}

class Wallets {
  /** @type {Map<string, Wallet>} */
  #data;
  /**  @type {Transactions} transacriotns */
  #transacions;
  /**
   * 
   * @param {Transactions} transacriotns 
   */
  constructor(transacriotns) {
    this.#data = new Map();
    this.#transacions = transacriotns
  }
  /**
   * @returns {boolean}
   * @param {Wallet} W
   */
  create(W) {
    const existing_wallet = this.get(W.id);
    if (existing_wallet) return false;
    this.#data.set(W.id, W);
    return true;
  }

  /**
   * @param {string} id
   * @returns {Wallet|undefined}
   */
  get(id) {
    return this.#data.get(id);
  }

  /**
   * @returns {boolean} 
   * @param {Wallet} W
   * @param {string} id 
   */
  update(id , W) {
    const wallet = this.get(id);
    if (!wallet) return false;
    this.#data.set(id , W);
    return true;
  }

  /**
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const wallet = this.get(id);
    if (!wallet) return false;
    this.#data.delete(id);
    return true;
  }

  /**
   * 
   * @param {string} wallet_id 
   * @param {number} amount
   * @return {boolean}
   */
  deposit(wallet_id , amount){
    let wallet = this.get(wallet_id)
    if(!wallet) return false
    const result = wallet.deposit(amount)
    if(!result.success) return false

    const T = new Transaction(amount , wallet_id , "deposit")
    this.#transacions.create(T)
    return true
  }

  withdraw (wallet_id, amount) {
      let wallet = this.get(wallet_id)
      if (!wallet) return false
      const result = wallet.withdraw(amount)
      if (!result.success) return false

      const T = new Transaction(amount, wallet_id, "withdraw")
      this.#transacions.create(T)
      return true
    }
  
}

class Transactions {
    /** @type {Map<string, Transaction>} */
    #data
    constructor() {
        this.#data = new Map()
    }
    /**
     * @returns {boolean}
     * @param {Transaction} T 
     */
    create(T){
        const existing_transaction = this.get(T.id);
        if (existing_transaction) return false;
        this.#data.set(T.id, T);
        return true;
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

    /**
     * @returns {boolean}
     * @param {Transaction} T
     * @param {string} id 
     */
    update(id , T){
        const transaction = this.get(id);
        if (!transaction) return false;
        this.#data.set(id , T);
        return true;
    }

    /**
     * @param {string} id
     * @returns {boolean}
     */
    delete(id){
        const transaction = this.get(id);
        if (!transaction) return false;
        this.#data.delete(id);
        return true;
    }
}

export default Store;