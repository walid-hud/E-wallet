import { log } from "console";
import http, {IncomingMessage, ServerResponse} from "http";
import url, {URL} from "url";
type Method = string | "get" | "post" | "patch" | "delete";
export type Route_handler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void | Promise<void>,
) => void | Promise<void>;
type Routes = Map<string, Route_handler[]>;
type Methods = Map<Method, Routes>;

class _press {
  private server: http.Server;
  private methods: Methods;
  private middlewares: Route_handler[] = [];
  private path_middlewares: Map<string, Route_handler[]> = new Map();
  constructor() {
    this.methods = new Map();
    this.server = http.createServer(this.handle.bind(this));
  }
  private register(method: Method, path: string, ...handlers: Route_handler[]) {
    if (this.methods.has(method)) {
      const registred_method = this.methods.get(method);
      if (registred_method?.has(path)) {
        const registred_handlers = registred_method.get(path)!;
        registred_method.set(path, [...registred_handlers, ...handlers]);
      } else {
        registred_method?.set(path, handlers);
      }
    } else {
      /*
        if the method isn't registred we:
        1 - create a new routes map to hold all routes related to the method
        e.g. 'get' : Map(2) { '/users' => null , '/admins' => null }
        2 - in the routes map we push the path and handler, I could use a set for the handlers
        to support having multiple handlers for same route but I'm not in the mood 
        */
      const routes: Routes = new Map();
      routes.set(path, handlers);
      this.methods.set(method, routes);
    }
  }

  
  use(handler: Route_handler, path?: string): void {
    if(!path){
      this.middlewares.push(handler);
    } else {
      if(this.path_middlewares.has(path)) {
        const existing_handlers = this.path_middlewares.get(path)!;
        existing_handlers.push(handler);
      } else {
        this.path_middlewares.set(path, [handler]);
      }
    }
  }


  private async run_middleware(req: IncomingMessage, res: ServerResponse) {
    const req_url = new URL(req.url!, "http://localhost:3000/");
    const path = req_url.pathname;
    
    // Combining global middlewares with path-specific middlewares
    const all_middlewares: Route_handler[] = [...this.middlewares];
    if(this.path_middlewares.has(path)) {
      const path_specific_handlers = this.path_middlewares.get(path)!;
      all_middlewares.push(...path_specific_handlers);
    }
    
    if(all_middlewares.length === 0) return

    let idx = 0;
    const next = async () => {
      const handler = all_middlewares[idx++];
      let called = false;
      if (!handler) {
        return;
      }

      await handler(req, res, () => {
        called = true;
        next();
      });
      if (!called && !res.writableEnded) {
        next();
      } else if (!called && res.writableEnded) {
        res.end();
      }
    };
    await next();
  }

  private async handle(req: IncomingMessage, res: ServerResponse) {
    
    await this.run_middleware(req, res);
    const req_method = req.method!.toLowerCase();
    const url = new URL(req.url!, "http://localhost:3000/");
    const path = url.pathname;
    const method = this.methods.get(req_method);
    if (!method) {
      res.statusCode = 400;
      res.write(JSON.stringify({error: `unsupported method : ${req.method}`}));
      res.end();
      return;
    }
    const handlers = method.get(path);
    if (!handlers) {
      res.statusCode = 404;
      res.write(JSON.stringify({error: `${path} not found`}));
      res.end();
      return;
    }
    let idx = 0;
    const next = async () => {
      const handler = handlers[idx++];
      let called = false;
      if (!handler) {
        return res.end();
      }
      await handler(req, res, () => {
        called = true;
        next();
      });
      if (!called && !res.writableEnded) {
        next();
      } else if (!called && res.writableEnded) {
        res.end();
      }
    };
    await next();
  }

  get(path: string, ...handlers: Route_handler[]) {
    this.register("get", path, ...handlers);
  }

  post(path: string, ...handlers: Route_handler[]) {
    this.register("post", path, ...handlers);
  }

  patch(path: string, ...handlers: Route_handler[]) {
    this.register("patch", path, ...handlers);
  }

  delete(path: string, ...handlers: Route_handler[]) {
    this.register("delete", path, ...handlers);
  }

  listen(port: number, cb: () => void) {
    if (!this.server?.listening) {
      this.server?.listen(port, cb);
    }
  }
}

export default function press() {
  return new _press();
}

export const json: Route_handler = async (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.setHeader("content-type", "application/json");
    res.statusCode = 400;
    res.write(JSON.stringify({success:false, error: "invalid request"}));
    res.end();
    return;
  }
  res.setHeader("content-type", "application/json");
  let body = "";
  req.on("data", (chunk) => {
    body += String(chunk);
  });


  return new Promise<void>((resolve)=>{
    req.on("end", async () => {
    try {
      const parsed = JSON.parse(body);
      Object.assign(req, {body: parsed});
      await next();
      resolve()
    } catch (error) {
      console.error(error);
      res.statusCode = 400;
      res.write(JSON.stringify({error: "invalide request"}));
      res.end();
      resolve()
      return;
    }
  });
  })
  
};
