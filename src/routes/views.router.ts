import { Router } from "express";
import ProductManager from "../managers/products.manager.ts";

const router = Router();

const productManager = new ProductManager("./src/products.json");

router.get("/", (req, res) => {
    const products = productManager.getProducts();
    const keys = ["title", "description", "code", "price", "category", "thumbnails"];
    res.render("home", { products, keys });
});

router.get("/realtimeproducts", (req, res) => {
    const products = productManager.getProducts();
    const keys = ["title", "description", "code", "price", "category", "thumbnails"];
    res.render("realTimeProducts", { products, keys });
});

export default router;
