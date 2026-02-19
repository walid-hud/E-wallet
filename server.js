import { log } from "node:console";
import express, { json } from "./lib/index.ts";
const app = express()

app.use(json)



app.listen(3000, () => {
    log("server running on http://localhost:3000")
})

