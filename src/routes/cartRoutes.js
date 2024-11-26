const express = require('express');
const CartModel = require('../models/CartModel');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await CartModel.create();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const carts = await CartModel.getAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
