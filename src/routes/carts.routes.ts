import { Router, Request, Response } from "express";
import CartManager from "../managers/carts.manager.ts";

const router = Router();

const cartManager = new CartManager("./src/carts.json");

router.post("/", async (req: Request, res: Response) => {
    try {
        const { id } = await req.body;
        if (!id) return res.status(400).json({ message: "Bad request", info: "Please, provide a valid id" });

        const newCart = cartManager.createCart(id);
        if (!newCart) return res.status(400).json({ message: "Attempt to create the cart has failed" });

        return res.status(200).json({ message: "Cart created successfully", cart: newCart });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.get("/:cid", async (req: Request, res: Response) => {
    try {
        const { cid } = req.params;
        const cartFound = cartManager.getCartbyId(cid);
        if (!cartFound)
            return res
                .status(404)
                .json({ message: "Cart not found", info: "The id of the cart was not found in the database" });
        return res.status(200).json({ message: "Success", products: cartFound.products });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.post("/:cid/products/:pid", async (req: Request, res: Response) => {
    try {
        const { cid, pid } = req.params;
        const cartFound = cartManager.addProductToCart(cid, pid);
        if (!cartFound)
            return res.status(404).json({
                message: "Cart not found",
                info: "The id of the cart was not found in the database",
            });
        return res.status(200).json({ message: "Product added to cart successfully", products: cartFound.products });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

export default router;
