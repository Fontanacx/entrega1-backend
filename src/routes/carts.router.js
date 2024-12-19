import { Router } from "express";
import CartsManager from "../managers/CartManager.js";
import ProductsManager from "../managers/ProductsManager.js";

const ROUTER = Router();
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

// GET TODOS LOS CARRITOS
ROUTER.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getCarts(req.query);
    res.status(200).json({ status: "success", payload: carts });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// GET CARRITO POR ID CON PRODUCTOS POPULADOS
ROUTER.get("/:id", async (req, res) => {
  try {
    const cart = await cartsManager.getById(req.params.id);
    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// RENDERIZAR VISTA DE CARRITO (NUEVO)
ROUTER.get("/:id/view", async (req, res) => {
  try {
    const cart = await cartsManager.getById(req.params.id);
    if (!cart) {
      return res.status(404).render("error", { message: "Carrito no encontrado" });
    }
    res.render("mycart", { products: cart.products }); // Asegúrate de que `cart.products` esté populado
  } catch (err) {
    res.status(err.code || 500).render("error", { message: err.message });
  }
});

// CREAR NUEVO CARRITO
ROUTER.post("/", async (req, res) => {
  try {
    const cart = await cartsManager.insertCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// AGREGAR PRODUCTO AL CARRITO
ROUTER.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const quantity = req.body.quantity || 1;

    const productFound = await productsManager.getById(productId);
    const cartFound = await cartsManager.getById(cartId);

    const cart = await cartsManager.insertProductToCart(cartFound, productFound, quantity);

    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// ACTUALIZAR CANTIDAD DE UN PRODUCTO EN EL CARRITO
ROUTER.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "Cantidad inválida",
      });
    }

    const cart = await cartsManager.updateProductQuantity(cartId, productId, quantity);

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// ELIMINAR UN PRODUCTO DEL CARRITO
ROUTER.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartsManager.removeProductFromCart(cartId, productId);

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// LIMPIAR COMPLETAMENTE EL CARRITO
ROUTER.delete("/:cartId/clear", async (req, res) => {
  try {
    const cart = await cartsManager.clearCart(req.params.cartId);

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

// FINALIZAR COMPRA
ROUTER.post("/:cartId/purchase", async (req, res) => {
  try {
    const cart = await cartsManager.finalizePurchase(req.params.cartId);

    res.status(200).json({
      status: "success",
      message: "Compra finalizada con éxito",
      payload: cart,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      status: "error",
      message: err.message,
    });
  }
});

export default ROUTER;
