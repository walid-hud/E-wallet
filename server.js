import { log } from "node:console";
import press, { json } from "./lib/index.ts";
import UserController from "./controllers/Users.controller.js";
const app = press()

app.use(json)
app.use((req , _ , next)=>{
    console.log(req.url)
    next()
})
app.use(UserController , "/users")


app.listen(3000, () => {
    log("server running on http://localhost:3000")
})

