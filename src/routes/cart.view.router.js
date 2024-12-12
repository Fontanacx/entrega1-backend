import { Router } from "express";
import CartsManager from "../managers/CartsManager.js";

const router = Router();
const cartsManager = new CartsManager();

router.get("/", async (req, res) => {
  try {
    const cart = await cartsManager.showProductInCart();
    res.render("cart", { cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
