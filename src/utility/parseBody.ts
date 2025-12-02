import { IncomingMessage } from "http";

export const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolved, rejected) => {
        let body = "";
        req.on("data", (chunk) => { body += chunk })
        req.on("end", () => {
            try {
                resolved(JSON.parse(body));
            } catch (error) {
                rejected(error);
            }
        })
    })
}
