import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";

// VIEWS
import home from "./routes/home.view.router.js";
import myCart from "./routes/mycart.view.router.js";
import addProduct from "./routes/addproduct.view.router.js";
import cartView from "./routes/cart.view.router.js"; // Asegurarse de importar esta ruta

const APP = express();
const PORT = 8080;

console.log('Antes de conectar a la base de datos');
connectDB().then(() => {
  console.log('Después de conectar a la base de datos');
}).catch((error) => {
  console.log('Error en la conexión:', error);
});

APP.use("/api/public", express.static("./src/public"));
APP.use(express.urlencoded({ extended: true }));
APP.use(express.json());

// TEMPLATES ENGINE
configHandlebars(APP);

// API ROUTES
APP.use("/api/products", productsRouter);
APP.use("/api/carts", cartsRouter);

// TEMPLATES ROUTES
APP.use("/", home);
APP.use("/my-cart", myCart);
APP.use("/add-product", addProduct);
APP.use("/cart", cartView); // Asegurarse de que la ruta esté configurada

// 404
APP.use("*", (req, res) => {
  res.status(404).render("404", { title: "Error 404" });
});

const httpServer = APP.listen(PORT, () => {
  console.log(`Ejecutando servidor en: http://localhost:${PORT}`);
});

configWebsocket(httpServer);
