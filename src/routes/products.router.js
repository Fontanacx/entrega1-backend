import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";

const router = Router();
const productsManager = new ProductsManager();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts({});
    res.status(200).json({ status: "success", payload: products });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
