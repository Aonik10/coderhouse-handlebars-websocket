import { v4 } from "uuid";
import Manager from "./manager.ts";

export interface ProductCreate {
    title: string;
    description: string;
    code: string;
    price: number;
    status: boolean;
    stock: number;
    category: string;
    thumbnails: string[];
}

export interface ProductCreated extends ProductCreate {
    id: string;
}

export type ProductUpdate = Partial<ProductCreate>;

export interface ErrorMessage {
    error: string;
}

export class ManagerErrorNotFound extends Error {
    constructor() {
        super("Manager error not found");
    }
}

class ProductManager extends Manager {
    products: ProductCreated[];

    constructor(public path: string) {
        super(path);
        this.products = this.readFile();
    }

    private validateCode(code: string): ProductCreated | undefined {
        const codeFound = this.products.find((product) => product.code === code);
        return codeFound;
    }

    public addProduct(product: ProductCreate): ProductCreated | ErrorMessage {
        try {
            const codeFound = this.validateCode(product.code);
            if (codeFound) throw new Error("Code already exists in the database");
            const productCreated = { ...product, id: v4() };
            this.products.push(productCreated);
            this.saveFile(this.products);
            return productCreated;
        } catch (error: any) {
            return { error: error.message };
        }
    }

    public getProducts() {
        return this.readFile<ProductCreated>();
    }

    public getProductById(id: string): ProductCreated | ErrorMessage {
        try {
            const productFound = this.products.find((product) => product.id === id);
            if (!productFound) throw new Error("Product not found");
            return productFound;
        } catch (error: any) {
            return { error: error.message };
        }
    }

    public updateProduct(id: string, propertiesToUpdate: ProductUpdate): ProductCreated {
        // find index of the product in the array of products
        let productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex == -1) throw new ManagerErrorNotFound();

        // // for each key in the body
        // for (let key in propertiesToUpdate) {
        //     //check if the key is a valid one, or if the user is trying to edit the product id
        //     if (!this.products[productIndex].hasOwnProperty(key) || key == "id") {
        //         throw new Error(`Invalid property: '${key}'. Please provide a valid property to update the product.`);
        //     }
        //     (this.products[productIndex] as any)[key] = (propertiesToUpdate as any)[key]; //consultar
        // }

        this.products[productIndex] = { ...this.products[productIndex], ...propertiesToUpdate };

        this.saveFile(this.products);
        return this.products[productIndex];
    }

    public deleteProduct(id: string): ProductCreated | ErrorMessage {
        try {
            // find index of the product in the array of products
            let productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex < 0) throw new Error("Product not found");

            // save the product in order to returning it at the end
            const productToDelete = this.products[productIndex];

            // remove the product of the array of products and save the array
            this.products.splice(productIndex, 1);
            this.saveFile(this.products);

            // return the deleted product
            return productToDelete;
        } catch (error: any) {
            return { error: error.message };
        }
    }
}

export default ProductManager;
