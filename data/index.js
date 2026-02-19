import { gen_id } from "../utils/index";

class Serializable {
    constructor() {
        this.id = gen_id();
    }
    /**
     * @returns {string}
     */
    json() {
        return JSON.stringify(this, (k, v) => {
            if (typeof v === "function") {
                return null;
            }
            return v;
        });
    }
}

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} id
 * @property {() => string} json
 */
class User extends Serializable {
    /**
     * @param {string} name
     */
    constructor(name) {
        super();
        this.name = name;
    }
}

/**
 * @typedef {Object} Wallet
 * @property {number} balance
 * @property {string} user_id
 * @property {string} name
 * @property {string} id
 * @property {() => string} json
 */
class Wallet extends Serializable {
    constructor(name, balance, user_id) {
        super();
        this.balance = balance;
        this.user_id = user_id;
        this.name = name;
    }
}

/**
 * @typedef {Object} Transaction
 * @property {number} amount
 * @property {string} wallet_id
 * @property {"deposit" | "withdraw"} type
 * @property {string} id
 * @property {() => string} json
 */
class Transaction extends Serializable {
    constructor(amount, wallet_id, type) {
        super();
        this.amount = amount;
        this.wallet_id = wallet_id;
        this.type = type;
    }
}

export {
    Serializable,
    User,
    Wallet,
    Transaction,
};