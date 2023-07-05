import fs from "fs";

class Manager {
    constructor(public path: string) {
        this.path = path;
    }

    public readFile<T>(): T[] {
        try {
            if (!fs.existsSync(this.path)) this.saveFile([]);
            const data = fs.readFileSync(this.path, "utf-8");
            return JSON.parse(data) as T[];
        } catch (error: any) {
            console.log(error.message);
            return [];
        }
    }

    public saveFile<T>(data: T[]): void {
        try {
            fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
        } catch (error: any) {
            console.log(error.message);
            throw error;
        }
    }
}

export default Manager;
