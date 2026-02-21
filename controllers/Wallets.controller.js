import { IncomingMessage, ServerResponse } from "node:http";
import store from "../data/index.js";
import { respond } from "../utils/index.js";

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const GET = (req, res, id) => {
    const wallet = store.Wallets.get(id);
    if (!wallet) {
        return respond(res, 404, { success: false, error: "wallet not found" });
    }
    return respond(res, 200, { success: true, error: null, wallet });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const POST = (req, res) => {
    const { name, user_id } = req.body;
    if (!name || !user_id) {
        return respond(res, 400, { success: false, error: "invalid request" });
    }

    const user = store.Users.get(user_id);
    if (!user) {
        return respond(res, 404, { success: false, error: "user not found" });
    }

    const new_wallet = store.Wallets.create(name, user_id);

    if (!new_wallet) {
        return respond(res, 400, { success: false, error: "wallet already exists" });
    }

    return respond(res, 200, { success: true, error: null, wallet: new_wallet });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const DELETE = (req, res, id) => {
    const wallet = store.Wallets.get(id);
    if (!wallet) {
        return respond(res, 404, { success: false, error: "wallet not found" });
    }

    const deleted = store.Wallets.delete(wallet.id);
    if (!deleted) {
        return respond(res, 400, { success: false, error: "wallet couldn't be deleted" });
    }

    return respond(res, 200, { success: true, error: null, wallet });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const PATCH = (req, res, id) => {
    const name = req.body.name;
    if (!name) {
        return respond(res, 400, { success: false, error: "invalid request" });
    }

    const wallet = store.Wallets.get(id);
    if (!wallet) {
        return respond(res, 404, { success: false, error: "wallet not found" });
    }

    wallet.name = name;
    return respond(res, 200, { success: true, error: null, wallet });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const PUT = (req, res, id) => {
    const { amount, type } = req.body;
    
    if (!amount || isNaN(amount) || amount < 1 || !Number.isInteger(amount)) {
        return respond(res, 400, { success: false, error: "invalid amount" });
    }

    if (type !== "deposit" && type !== "withdraw") {
        return respond(res, 400, { success: false, error: "invalid type. Must be 'deposit' or 'withdraw'" });
    }

    const wallet = store.Wallets.get(id);
    if (!wallet) {
        return respond(res, 404, { success: false, error: "wallet not found" });
    }

    const result = type === "deposit" 
        ? store.Wallets.deposit(id, amount)
        : store.Wallets.withdraw(id, amount);

    if (!result.success) {
        const error_reason = result.error?.reason || `${type} failed`;
        return respond(res, 400, { success: false, error: error_reason });
    }

    const updated_wallet = store.Wallets.get(id);
    return respond(res, 200, { success: true, error: null, wallet: updated_wallet });
};

/** @type {Record<string, (req: IncomingMessage, res: ServerResponse, id?: string) => void | Promise<void>>} */
const methodHandlers = {
    GET,
    POST,
    DELETE,
    PATCH,
    PUT,
};

/**
 * @type {(req: IncomingMessage, res: ServerResponse, next: () => void | Promise<void>) => void | Promise<void>} 
 */
const WalletController = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    const { id } = req.body;
    if (!id && req.method !== "POST") {
        respond(res, 400, { success: false, error: "invalid request" });
        return;
    }

    const handler = methodHandlers[req.method ?? ""];

    if (!handler) {
        return respond(res, 400, { success: false, error: "unsupported method" });
    }

    if (req.method === "POST") {
        handler(req, res);
    } else {
        handler(req, res, id);
    }

    if (typeof next === "function") {
        return next();
    }
};


export default WalletController

