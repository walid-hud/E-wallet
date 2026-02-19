import { randomUUID } from "node:crypto";

export function gen_id(){
    return randomUUID().slice(0,4) // keep ids short for demo
}