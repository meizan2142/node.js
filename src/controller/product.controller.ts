import { IncomingMessage, ServerResponse } from "http";
import { readProduct, writeProduct } from "../services/product.service";
import { IProduct } from "../types/product.interface";
import { parseBody } from "../utility/parseBody";
import { SendResponse } from "../utility/sendResponse";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    const urlPart = url?.split("/");
    const id = urlPart && urlPart[1] === "products" ? Number(urlPart[2]) : null

    if (url === "/products" && method === "GET") {
        try {
            const products = readProduct();
            return SendResponse(res, 200, true, products, "Products retrived successfully");

        } catch (error) {
            return SendResponse(res, 200, false, error);
        }
    }

    // * Get Method
    else if (method === 'GET' && id !== null) {
        try {
            const products = readProduct();
            const product = products.find((p: IProduct) => p.id === id)
            return SendResponse(res, 200, true, product, "Single product");

        } catch (error) {
            return SendResponse(res, 200, false, error);
        }
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
        res.writeHead(201, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Product added successfully", allProduct: newProduct }));
        return;
    }

    // * PUT Method
    else if (method === 'PUT' && id !== null) {
        const body = await parseBody(req);
        const products = readProduct();
        const index = products.findIndex((p: IProduct) => p.id === id);
        if (index < 0) {
            res.writeHead(201, { "content-type": "application/json" })
            res.end(JSON.stringify({ message: "Product not found" }));
            return;
        }
        products[index] = { id: products[index].id, ...body };
        writeProduct(products);
        res.writeHead(201, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Product updated successfully", data: products[index] }));
        return;
    }

    // * DELETE Method
    else if (method === "DELETE" && id !== null) {
        const body = await parseBody(req);
        const products = readProduct();
        const index = products.findIndex((p: IProduct) => p.id === id);
        if (index < 0) {
            res.writeHead(201, { "content-type": "application/json" })
            res.end(JSON.stringify({ message: "Product not found" }));
            return;
        }
        products.splice(index, 1);
        writeProduct(products);
        res.writeHead(201, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Product deleted successfully" }));
        return;
    }

}