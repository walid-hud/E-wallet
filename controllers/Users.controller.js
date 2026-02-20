import { IncomingMessage, ServerResponse } from "node:http";
import store from "../data/index.js";
import { respond } from "../utils/index.js";

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const GET = (req, res, id) => {
    const user = store.Users.get(id);
    if (!user) {
        return respond(res, 404, { success: false, error: "user not found" });
    }
    return respond(res, 200, { success: true, error: null, user });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const POST = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return respond(res, 400, { success: false, error: "invalid request" });
    }

    const new_user = store.Users.create(name);

    if (!new_user) {
        return respond(res, 400, { success: false, error: "user already exist" });
    }

    return respond(res, 200, { success: true, error: null, user: new_user });
};

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {string} id
 */
const DELETE = (req, res, id) => {
    const user = store.Users.get(id);
    if (!user) {
        return respond(res, 404, { success: false, error: "user not found" });
    }

    const deleted = store.Users.delete(user.id);
    if (!deleted) {
        return respond(res, 400, { success: false, error: "user couldn't be deleted" });
    }

    return respond(res, 200, { success: true, error: null, user });
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

    const user = store.Users.get(id);
    if (!user) {
        return respond(res, 404, { success: false, error: "user not found" });
    }

    user.name = name;
    return respond(res, 200, { success: true, error: null, user });
};

/** @type {Record<string, (req: IncomingMessage, res: ServerResponse, id?: string) => void | Promise<void>>} */
const methodHandlers = {
    GET,
    POST,
    DELETE,
    PATCH,
};

/**
 * @type {(req: IncomingMessage, res: ServerResponse, next: () => void | Promise<void>) => void | Promise<void>} 
 */
const UserController = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    const { id } = req.body || {};

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


export default UserController