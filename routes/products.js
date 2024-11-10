import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('./products.json', 'utf-8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Ruta para obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const data = await fs.readFile('./products.json', 'utf-8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
});

export default router;
