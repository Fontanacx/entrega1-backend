import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('./carts.json', 'utf-8');
    const carts = JSON.parse(data);
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos' });
  }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const data = await fs.readFile('./carts.json', 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const data = await fs.readFile('./carts.json', 'utf-8');
    const carts = JSON.parse(data);
    const newCart = {
      id: String(carts.length + 1),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile('./carts.json', JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
});

export default router;
