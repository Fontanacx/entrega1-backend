import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts({});
    res.render("home", { products });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

export default router;
