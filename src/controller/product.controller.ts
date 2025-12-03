import { IncomingMessage, ServerResponse } from "http";
import { readProduct, writeProduct } from "../services/product.service";
import { IProduct } from "../types/product.interface";
import { parseBody } from "../utility/parseBody";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    const urlPart = url?.split("/");
    const id = urlPart && urlPart[1] === "products" ? Number(urlPart[2]) : null
    // console.log(id);

    if (url === "/products" && method === "GET") {
        const products = readProduct();
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "this is product route", allProduct: products }));
    }
    // * Get Method
    else if (method === 'GET' && id !== null) {
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id)
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ allProduct: product }));
    }
    // * Post Method
    else if (method === 'POST' && url === "/products") {
        const body = await parseBody(req);
        const products = readProduct();
        const newProduct = {
            id: Date.now(),
            ...body
        }
        products.push(newProduct);
        writeProduct(products);
    }
}