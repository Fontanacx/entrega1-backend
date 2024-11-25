const express = require('express');
const ProductModel = require('../models/ProductModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await ProductModel.add(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; // Asegúrate de exportar solo el router
