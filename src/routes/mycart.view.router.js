import { Router } from "express";
import CartsManager from "../managers/CartsManager.js";

const ROUTER = Router();
const cartsManager = new CartsManager();

// Ruta para renderizar el carrito
ROUTER.get("/", async (req, res) => {
  try {
    const productsInCart = await cartsManager.showProductInCart(); // Obtener productos del carrito
    res.render("mycart", {
      title: "Tu Carrito",
      products: productsInCart, // Pasar los productos a la vista
      error: null
    });
  } catch (err) {
    res.status(500).render("mycart", {
      title: "Tu Carrito",
      products: [],
      error: err.message // Manejar errores
    });
  }
});

export default ROUTER;
