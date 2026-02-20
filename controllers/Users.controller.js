import { IncomingMessage, ServerResponse } from "node:http"
import store from "../data/index.js"
import { toJson } from "../utils/index.js"

/**
 * @type {(req: IncomingMessage, res: ServerResponse, next: () => void | Promise<void>, ) => void | Promise<void>} 
 */
const UserController = (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    const { id } = req.body
    if (!id && req.method !== "POST") {
        res.statusCode = 400
        res.end(toJson({ success: false, error: "invalid request" }))
        next()
        return
    }
    switch (req.method) {
        case "GET":
            const user = store.Users.get(id)
            if (!user) {
                res.statusCode = 404
                res.end(toJson({ success: false, error: "user not found" }))
                break
            }
            res.statusCode = 200
            res.end(toJson({ success: true, error: null, user }))
            break

        case "POST":
            let { name } = req.body
            if (!name) {
                res.statusCode = 400
                res.end(toJson({ success: false, error: "invalid request" }))
                break
            }
            const new_user = store.Users.create(name)

            if (!new_user) {
                res.statusCode = 400
                res.end(toJson({ success: false, error: "user already exist" }))
                break
            }
            res.statusCode = 200
            res.end(toJson({ success: true, error: null, user: new_user }))
            break
        case "DELETE":
            const user_to_delete = store.Users.get(id)
            if (!user_to_delete) {
                res.statusCode = 404
                res.end(toJson({ success: false, error: "user not found" }))
                break
            }
            let deleted = store.Users.delete(user_to_delete.id)
            if (!deleted) {
                res.statusCode = 400
                res.end(toJson({ success: false, error: "user couldn't be deleted" }))
                break
            }
            res.statusCode = 200
            res.end(toJson({ success: true, error: null, user:user_to_delete }))
            break

        case "PATCH":
            let user_name = req.body.name
            if (!user_name) {
                res.statusCode = 400
                res.end(toJson({ success: false, error: "invalid request" }))
                break
            }
            let user_to_update = store.Users.get(id)
            if (!user_to_update) {
                res.statusCode = 404
                res.end(toJson({ success: false, error: "user not found" }))
                break
            }
            user_to_update.name = user_name
            res.statusCode = 200
            res.end(toJson({ success: true, error: null, user:user_to_update }))
            break


        default:
            res.statusCode = 400
            res.end(toJson({ success: false, error: "unsupported method" }))
            break
    }
    next()



}

export default UserController