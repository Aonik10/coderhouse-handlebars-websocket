import express from "express";
import cartsRouter from "./routes/carts.routes.ts";
import productsRouter from "./routes/products.routes.ts";
import viewsRouter from "./routes/views.router.ts";
import morgan from "morgan";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.ts";
import ProductManager from "./managers/products.manager.ts";

const productManager = new ProductManager("./src/products.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const httpServer = app.listen(8080, () => {
    console.log("Server listening on port 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`);
    });

    socket.on("createProduct", (product) => {
        productManager.addProduct(product);
        console.log("product created");
        socketServer.emit("getAllProducts", productManager.getProducts());
    });
});
