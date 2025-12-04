import { ServerResponse } from "http";

export const SendResponse = (res: ServerResponse, statusCode: number, success: boolean, data?: any, message?: string) => {
    const response = {
        message: message,
        data: data,
        success: success,
    }
    res.writeHead(statusCode, { "content-type": "application/json" })
    res.end(JSON.stringify(response));
}