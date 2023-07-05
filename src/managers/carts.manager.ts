import Manager from "./manager.ts";
import { v4 } from "uuid";

interface cartProduct {
    product: string;
    quantity: number;
}

export interface Cart {
    id: string;
    products: cartProduct[];
}

class CartManager extends Manager {
    carts: Cart[];

    constructor(public path: string) {
        super(path);
        this.carts = this.readFile();
    }

    public createCart(productId: string): Cart | undefined {
        try {
            const cart = {
                id: v4(),
                products: [
                    {
                        product: productId,
                        quantity: 1,
                    },
                ],
            };
            this.carts.push(cart);
            this.saveFile(this.carts);
            return cart;
        } catch (error: any) {
            console.log(error.message);
        }
    }

    public getCarts() {
        return this.readFile<Cart>();
    }

    public addProductToCart(cartId: string, productId: string): Cart | undefined {
        try {
            // if there is a cartId, find it
            const cartFound = this.carts.find((cart) => cart.id === cartId);
            if (!cartFound) throw new Error("Cart not found");

            // check if product already exists in the cart
            const productFound = cartFound.products.find((p) => p.product == productId);
            if (productFound) {
                productFound.quantity++;
            } else {
                cartFound.products.push({ product: productId, quantity: 1 });
            }
            this.saveFile(this.carts);
            return cartFound;
        } catch (error: any) {
            console.log(error.message);
        }
    }

    public getCartbyId(id: string): Cart | undefined {
        try {
            const cartFound = this.carts.find((cart) => cart.id === id);
            if (!cartFound) throw new Error("Cart not found");
            return cartFound;
        } catch (error: any) {
            console.log(error.message);
        }
    }
}

export default CartManager;
