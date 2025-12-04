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
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const newProduct = {
                id: Date.now(),
                ...body
            }
            products.push(newProduct);
            writeProduct(products);
            return SendResponse(res, 201, true, products, "New Product added successfully");
        } catch (error) {
            return SendResponse(res, 201, false, error);
        }
    }

    // * PUT Method
    else if (method === 'PUT' && id !== null) {
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const index = products.findIndex((p: IProduct) => p.id === id);
            if (index < 0) {
                return SendResponse(res, 201, false, "Product not found");
            }
            products[index] = { id: products[index].id, ...body };
            writeProduct(products);
            return SendResponse(res, 201, true, products, "Data updated");
        } catch (error) {
            return SendResponse(res, 201, false, error);
        }
    }

    // * DELETE Method
    else if (method === "DELETE" && id !== null) {
        try {
            const body = await parseBody(req);
            const products = readProduct();
            const index = products.findIndex((p: IProduct) => p.id === id);
            if (index < 0) {
                return SendResponse(res, 201, false, "Product not found");
            }
            products.splice(index, 1);
            writeProduct(products);
            return SendResponse(res, 201, true, "Product deleted successfully")
        } catch (error) {
            return SendResponse(res, 201, false, error);
        }
    }

}