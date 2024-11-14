import { Router } from 'express';
import CartManager from '../managers/cartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST - Crear un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
});

// POST - Agregar producto al carrito
router.post('/:cartId/products', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const updatedCart = await cartManager.addProductToCart(req.params.cartId, productId, quantity);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});

export default router;
