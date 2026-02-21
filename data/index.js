import { log  } from "node:console";
import Store from "./store.js";
const store = new Store();

const user = store.Users.create("user");
const wallet = store.Wallets.create("user wallet", user.id);
log(user);
log(wallet);

export default store;
