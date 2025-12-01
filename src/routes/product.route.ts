import { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";

export const productRoute = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    
    if (url === "/" && method === "GET") {
        // console.log("This is root route");
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "this is root url" }));
    }
    else if (url?.startsWith("/products")) {
        // res.end(JSON.stringify({message: "This is product route"}))
        console.log(req);
        
        productController(req, res);
    }
    else {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "This is not the root" }));
    }
} 