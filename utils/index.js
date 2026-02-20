import { randomUUID } from "node:crypto";

export function gen_id(){
    return randomUUID().slice(0,8) // keep ids short for demo
}
export const toJson = (obj)=>JSON.stringify(obj)