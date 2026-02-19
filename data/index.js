import {gen_id} from "../utils/index"
class Serializable {
    constructor(){
        this.id = gen_id()
    }
    json(){
        return JSON.stringify(this , (k , v)=>{
            if(typeof v === "function"){
                return null
            }
            return v
        })
    }
} 


class User extends Serializable{
    constructor(name){
        super()
        this.name = name
    }
}


class Wallet extends Serializable{
    constructor(){
        super()
        
    }
}