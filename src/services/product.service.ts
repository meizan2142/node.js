import path from "path";
import fs from "fs"

const filePath = path.join(process.cwd(), "./src/database/database.json")

export function readProduct() {
    // console.log(filePath);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

export const writeProduct = (product: any) => {
    fs.writeFileSync(filePath, JSON.stringify(product));
}