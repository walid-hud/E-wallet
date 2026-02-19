import { gen_id } from "../utils/index";
export class Serializable {
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
 * @method json
 * @returns {string}
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
 * @method json
 * @returns {string}
 * @method deposit
 * @returns {result}
 * @method withdraw
 * @returns {result}
 */
export class Wallet extends Serializable {
  constructor(name, balance, user_id) {
    super();
    this.balance = balance;
    this.user_id = user_id;
    this.name = name;
  }
  /**
   * @typedef {{success:boolean , error:undefined|{reason:string} }} result
   * @returns {result}
   * @param {number} amount
   */
  deposit(amount) {
    /**@type {result} */
    let result = { success: false, error: {} };
    if (isNaN(amount) || amount < 1 || !Number.isInteger(amount)) {
      result.error.reason = "invalid amount";
      result.success = false;
      return result;
    }
    this.balance += amount;
    return result;
  }

  withdraw(amount) {
    /**@type {result} */
    let result = {success:false  , error:{}};
    if (isNaN(amount) || amount < 1 || !Number.isInteger(amount)) {
      result.error.reason = "invalid amount";
      return result;
    }
    if(this.balance - amount <  0){
      result.error.reason = "insufficient balance";
      result.success = false;
      return result;
    }
    this.balance -= amount
    result.success = true 
    return result;
  }
}


/**
 * @typedef {Object} Transaction
 * @property {number} amount
 * @property {string} wallet_id
 * @property {"deposit" | "withdraw"} type
 * @property {string} id
 * @property {Date} date
 * @method json
 * @returns {string}
 */
export class Transaction extends Serializable {
  /**
   * 
   * @param {number} amount 
   * @param {string} wallet_id 
   * @param {"withdraw"|"deposit"} type 
   */
  constructor(amount, wallet_id, type) {
    super();
    this.amount = amount;
    this.wallet_id = wallet_id;
    this.type = type;
    this.date = new Date()
  }
}
