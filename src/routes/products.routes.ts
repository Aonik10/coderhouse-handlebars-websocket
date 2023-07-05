import { Router, Request, Response } from "express";
import ProductManager, { ManagerErrorNotFound, ProductCreate, ProductUpdate } from "../managers/products.manager.ts";

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get("/", async (req: Request, res: Response) => {
    try {
        const { limit } = req.query;
        let products = productManager.getProducts();

        if (!products) throw new Error("Attempt to products database failed.");
        if (limit) products = products.slice(0, Number(limit));

        return res.status(200).json({ message: "Success", products });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const body = (await req.body) as ProductCreate;

        // must implement something to validate the body (thinking in express-validator package)
        const newProduct = productManager.addProduct(body);

        if (!newProduct)
            return res
                .status(400)
                .json({ message: "Product code already exists in the database, please try with a different code" });

        // return res.status(200).json({ message: "Product created successfully", product: newProduct });
        res.redirect("/");
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.post("/realtime", async (req: Request, res: Response) => {
    res.redirect("/realtimeproducts");
});

router.get("/:pid", async (req: Request, res: Response) => {
    try {
        const { pid } = req.params;
        const product = productManager.getProductById(pid);

        if (!product)
            return res.status(404).json({
                message: "Product not found",
                info: "The id of the product was not found in the database",
            });

        return res.status(200).json({
            message: "Success",
            product,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.put("/:pid", async (req: Request, res: Response) => {
    try {
        const { pid } = req.params;
        const body = (await req.body) as ProductUpdate;

        // attemp to update the product
        const updatedProduct = productManager.updateProduct(pid, body);

        // if productUpdated has the key error, it means something went wrong in the productManager "updateProduct" method
        if (updatedProduct.hasOwnProperty("error")) {
            return res.status(400).json({ message: "An error ocurred", ...updatedProduct });
        }

        // if everything is ok, return success message with the productUpdated
        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error: any) {
        if (error instanceof ManagerErrorNotFound) return res.status(404).json({ message: "Product not found" });
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.delete("/:pid", async (req: Request, res: Response) => {
    try {
        const { pid } = req.params;

        // attemp to delete the product
        const deletedProduct = productManager.deleteProduct(pid);

        // if deleteProduct methods returns undefined, returns 404 status code response
        if (deletedProduct.hasOwnProperty("error"))
            return res.status(400).json({ message: "An error ocurred", ...deletedProduct });

        // if everything is ok, return 200 status code response with the deletedProduct
        return res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

export default router;
